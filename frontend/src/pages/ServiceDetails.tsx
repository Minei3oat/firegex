import { ActionIcon, Grid, LoadingOverlay, Space, Title } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { BsTrashFill } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';
import RegexView from '../components/RegexView';
import ServiceRow from '../components/ServiceRow';
import YesNoModal from '../components/YesNoModal';
import { RegexFilter, Service, update_freq } from '../js/models';
import { deleteservice, errorNotify, okNotify, regenport, serviceinfo, serviceregexlist } from '../js/utils';
import { BsArrowRepeat } from "react-icons/bs"

function ServiceDetails() {
    const {srv_id} = useParams()

    const [serviceInfo, setServiceInfo] = useState<Service>({
        id:srv_id?srv_id:"",
        internal_port:0,
        n_packets:0,
        n_regex:0,
        name:srv_id?srv_id:"",
        public_port:0,
        status:"🤔"
    })

    const [regexesList, setRegexesList] = useState<RegexFilter[]>([])
    const [loader, setLoader] = useState(true);

    const navigator = useNavigate()

    const updateInfo = async () => {
        if (!srv_id) return
        let error = false;
        await serviceinfo(srv_id).then(res => {
            setServiceInfo(res)
        }).catch(
          err =>{
            error = true;
            navigator("/")
        })
        if (error) return
        await serviceregexlist(srv_id).then(res => {
            setRegexesList(res)
        }).catch(
          err => errorNotify(`Updater for ${srv_id} service failed [Regex list]!`, err.toString())
        )
        setLoader(false)
    }

    useEffect(()=>{
        updateInfo()
        const updater = setInterval(updateInfo, update_freq)
        return () => { clearInterval(updater) }
    },[]);

    const [deleteModal, setDeleteModal] = useState(false)
    const [changePortModal, setChangePortModal] = useState(false)
    
    const deleteService = () => {
        deleteservice(serviceInfo.id).then(res => {
            if (!res)
                okNotify("Service delete complete!",`The service ${serviceInfo.id} has been deleted!`)
            else
                errorNotify("An error occurred while deleting a service",`Error: ${res}`)
        }).catch(err => {
            errorNotify("An error occurred while deleting a service",`Error: ${err}`)
        })
    }

    const changePort = () => {
        regenport(serviceInfo.id).then(res => {
            if (!res)
                okNotify("Service port regeneration completed!",`The service ${serviceInfo.id} has changed the internal port!`)
            else
                errorNotify("An error occurred while changing the internal service port",`Error: ${res}`)
        }).catch(err => {
            errorNotify("An error occurred while changing the internal service port",`Error: ${err}`)
        })
    }

    return <div>
        <LoadingOverlay visible={loader} />
        <ServiceRow service={serviceInfo} additional_buttons={<>
            <ActionIcon color="red" onClick={()=>setDeleteModal(true)} size="xl" radius="md" variant="filled"><BsTrashFill size={22} /></ActionIcon>
            <Space w="md"/>
            <ActionIcon color="blue" onClick={()=>setChangePortModal(true)} size="xl" radius="md" variant="filled"><BsArrowRepeat size={28} /></ActionIcon>
            <Space w="md"/>
        </>}></ServiceRow>
        {regexesList.length === 0? 
            <><Space h="xl" /> <Title className='center-flex' order={3}>No regex found for this service! Add one clicking the add button above</Title></>:
            <Grid>
                {regexesList.map( (regexInfo) => <Grid.Col key={regexInfo.id} span={6}><RegexView regexInfo={regexInfo}/></Grid.Col>)}
            </Grid>
        }
        <YesNoModal
            title='Are you sure to delete this service?'
            description={`You are going to delete the service '${serviceInfo.id}', causing the stopping of the firewall and deleting all the regex associated. This will cause the shutdown of your service ⚠️!`}
            onClose={()=>setDeleteModal(false)}
            action={deleteService}
            opened={deleteModal}
        />
        <YesNoModal
            title='Are you sure to change the proxy internal port?'
            description={`You are going to change the proxy port '${serviceInfo.internal_port}'. This will cause the shutdown of your service temporarily ⚠️!`}
            onClose={()=>setChangePortModal(false)}
            action={changePort}
            opened={changePortModal}
        />
    </div>
}

export default ServiceDetails;

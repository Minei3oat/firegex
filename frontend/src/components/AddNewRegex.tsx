import { Button, Group, Space, TextInput, Notification, Switch, Modal, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { RegexAddForm } from '../js/models';
import { b64decode, b64encode, getapiobject, okNotify } from '../js/utils';
import { ImCross } from "react-icons/im"

type RegexAddInfo = {
    regex:string,
    mode:string,
    is_case_insensitive:boolean,
    deactive:boolean
}

function AddNewRegex({ opened, onClose, service }:{ opened:boolean, onClose:()=>void, service:string }) { 

    const form = useForm({
        initialValues: {
            regex:"",
            mode:"C",
            is_case_insensitive:false,
            deactive:false
        },
        validate:{
            regex: (value) => value !== "" ? null : "Regex is required",
            mode: (value) => ['C', 'S', 'B'].includes(value) ? null : "Invalid mode",
        }
    })

    const close = () =>{
        onClose()
        form.reset()
        setError(null)
    }

    const [submitLoading, setSubmitLoading] = useState(false)
    const [error, setError] = useState<string|null>(null)

    const submitRequest = (values:RegexAddInfo) => {
        setSubmitLoading(true)

        const request:RegexAddForm = {
            is_case_sensitive: !values.is_case_insensitive,
            service_id: service,
            mode: values.mode?values.mode:"B",
            regex: b64encode(values.regex),
            active: !values.deactive
        }
        setSubmitLoading(false)
        getapiobject().regexesadd(request).then( res => {
            if (!res){
                setSubmitLoading(false)
                close();
                okNotify(`Regex ${b64decode(request.regex)} has been added`, `Successfully added  ${request.is_case_sensitive?"case sensitive":"case insensitive"} regex to ${request.service_id} service`)
            }else if (res.toLowerCase() === "invalid regex"){
                setSubmitLoading(false)
                form.setFieldError("regex", "Invalid Regex")
            }else{
                setSubmitLoading(false)
                setError("Error: [ "+res+" ]")
            }
        }).catch( err => {
            setSubmitLoading(false)
            setError("Request Failed! [ "+err+" ]")
        })
        
    }    


  return <Modal size="xl" title="Add a new regex filter" opened={opened} onClose={close} closeOnClickOutside={false} centered>
    <form onSubmit={form.onSubmit(submitRequest)}>
            <TextInput
                label="Regex"
                placeholder="[A-Z0-9]{31}="
                {...form.getInputProps('regex')}
            />
            <Space h="md" />
            <Switch
                label="Case insensitive"
                {...form.getInputProps('is_case_insensitive', { type: 'checkbox' })}
            />
            <Space h="md" />
            <Switch
                label="Deactivate"
                {...form.getInputProps('deactive', { type: 'checkbox' })}
            />
            <Space h="md" />
            <Select
                data={[
                    { value: 'C', label: 'Client -> Server' },
                    { value: 'S', label: 'Server -> Client' },
                    { value: 'B', label: 'Both (Client <-> Server)' },
                ]}
                label="Choose the source of the packets to filter"
                variant="filled"
                {...form.getInputProps('mode')}
            />
            <Group align="right" mt="md">
                <Button loading={submitLoading} type="submit">Add Filter</Button>
            </Group>

            <Space h="md" />
            
            {error?<>
            <Notification icon={<ImCross size={14} />} color="red" onClose={()=>{setError(null)}}>
                Error: {error}
            </Notification><Space h="md" /></>:null}
            
        </form>
    </Modal>

}

export default AddNewRegex;

import { Center, Grid, SegmentedControl, Text, Title, Box, Badge, Space, ActionIcon } from '@mantine/core';
import React, { useState } from 'react';
import { RegexFilter } from '../../js/models';
import { getHumanReadableRegex } from '../../js/utils';
import style from "./RegexView.module.scss";
import { FaListAlt } from "react-icons/fa"
import { TiCancel } from "react-icons/ti"
import { BsTrashFill } from "react-icons/bs"
import YesNoModal from '../YesNoModal';
import FilterTypeSelector from '../FilterTypeSelector';


function RegexView({ regexInfo }:{ regexInfo:RegexFilter }) {

  const mode_string = regexInfo.mode === "C"? "C -> S":
                      regexInfo.mode === "S"? "S -> C":
                      regexInfo.mode === "B"? "S <-> C": "🤔"

  let regex_expr = getHumanReadableRegex(regexInfo.regex);
  let exact_regex = true;

  if (regex_expr.length>=4 && regex_expr.startsWith(".*") && regex_expr.endsWith(".*")){
    regex_expr = regex_expr.substring(2,regex_expr.length-2)
    exact_regex = false;
  }

  const [deleteModal, setDeleteModal] = useState(false);

  return <div className={style.box}>
        <Grid>
          <Grid.Col span={2}>
            <Title order={2} style={{color:"#FFF"}}>Regex:</Title> 
          </Grid.Col>
          <Grid.Col span={8}>
            <Text className={style.regex_text}> {regex_expr}</Text>
          </Grid.Col>
          <Grid.Col span={2}>
            <ActionIcon color="red" onClick={()=>setDeleteModal(true)} size="xl" radius="md" variant="filled"><BsTrashFill size={22} /></ActionIcon>
          </Grid.Col>
          <Grid.Col span={2} />
          <Grid.Col className='center-flex-row' span={4}>
            <Space h="xs" />
            <FilterTypeSelector 
                size="md"
                color="gray"
                disabled
                value={regexInfo.is_blacklist?"blacklist":"whitelist"}
            />
            <Space h="md" />
            <div className='center-flex'>
              <Badge size="md" color="green" variant="filled">Service: {regexInfo.service_id}</Badge>
              <Space w="xs" />
              <Badge size="md" color="gray" variant="filled">ID: {regexInfo.id}</Badge>
            </div>
          </Grid.Col>
          <Grid.Col style={{width:"100%"}} span={6}>
            <Space h="xs" />
            <div className='center-flex-row'>
              <Badge size="md" color={exact_regex?"grape":"pink"} variant="filled">Match: {exact_regex?"EXACT":"FIND"}</Badge>
              <Space h="xs" />
              <Badge size="md" color="yellow" variant="filled">Packets filtered: {regexInfo.n_packets}</Badge>
              <Space h="xs" />
              <Badge size="md" color="blue" variant="filled">Mode: {mode_string}</Badge>
            </div>
          </Grid.Col>
        </Grid>
        <YesNoModal
            title='Are you sure to delete this regex?'
            description={`You are going to delete the regex '${regex_expr}', causing the restart of the firewall if it is active.`}
            onClose={()=>setDeleteModal(false)}
            action={()=>console.log("Delete regex please!")}
            opened={deleteModal}
        />
        
  </div>
}

export default RegexView;
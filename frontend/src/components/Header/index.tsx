import React, { useState } from 'react';
import { ActionIcon, Divider, Image, Menu, Tooltip, FloatingTooltip, MediaQuery, Burger, Space, Header } from '@mantine/core';
import style from "./index.module.scss";
import { errorNotify, gatmainpath, logout } from '../../js/utils';
import { AiFillHome } from "react-icons/ai"
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import { MdOutlineSettingsBackupRestore } from 'react-icons/md';
import { ImExit } from 'react-icons/im';
import ResetPasswordModal from './ResetPasswordModal';
import ResetModal from './ResetModal';


function HeaderPage({navOpen, setNav, ...other}: { navOpen: boolean, setNav:React.Dispatch<React.SetStateAction<boolean>>}) {
  
  const navigator = useNavigate()
  
  const logout_action = () => {
    logout().then(r => {
        window.location.reload()
    }).catch(r => {
      errorNotify("Logout failed!",`Error: ${r}`)
    })
  } 

  const go_to_home = () => {
    navigator(`/${gatmainpath()}`)
  }

  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [resetFiregexModal, setResetFiregexModal] = useState(false);
  const [tooltipHomeOpened, setTooltipHomeOpened] = useState(false);
  const [tooltipLogoutOpened,setTooltipLogoutOpened] = useState(false);

  return <Header height={100} className={style.header} {...other}>
        <Space w="lg" />
        <MediaQuery largerThan="md" styles={{ display: 'none' }}><div>
          <Burger
            opened={navOpen}
            className={style.navbtn}
            onClick={() => setNav((o) => !o)}
            size="sm"
            mr="xl"
          />
        </div></MediaQuery>
        <div className={style.divlogo}>
          <FloatingTooltip zIndex={0} label="Home" transition="pop" transitionDuration={200} openDelay={1000} transitionTimingFunction="ease" color="dark" position="right" >
            <Image src="/header-logo.png" alt="Firegex logo" onClick={()=>navigator("/")}/>
          </FloatingTooltip>
        </div>
        
        <div className="flex-spacer" />        
      
        
        <Menu>
          <Menu.Label>Firewall Access</Menu.Label>
          <Menu.Item icon={<FaLock size={14} />} onClick={() => setChangePasswordModal(true)}>Change Password</Menu.Item>
          <Divider />
          <Menu.Label>Actions</Menu.Label>
          <Menu.Item color="red" icon={<MdOutlineSettingsBackupRestore size={18} />} onClick={() => setResetFiregexModal(true)}>Reset Firegex</Menu.Item>
          
        </Menu>
        <Space w="md" />
        <Tooltip label="Home" position='bottom' transition="pop" transitionDuration={200} transitionTimingFunction="ease" color="teal" opened={tooltipHomeOpened} tooltipId="tooltip-home-id">
          <ActionIcon color="teal" style={{marginRight:"10px"}}
            size="xl" radius="md" variant="filled"
            onClick={go_to_home}
            onFocus={() => setTooltipHomeOpened(false)} onBlur={() => setTooltipHomeOpened(false)}
            onMouseEnter={() => setTooltipHomeOpened(true)} onMouseLeave={() => setTooltipHomeOpened(false)}>
            <AiFillHome size="25px" />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Logout" position='bottom' transition="pop" transitionDuration={200}  transitionTimingFunction="ease" color="blue" opened={tooltipLogoutOpened} tooltipId="tooltip-add-id">
          <ActionIcon color="blue" onClick={logout_action} size="xl" radius="md" variant="filled"
            onFocus={() => setTooltipLogoutOpened(false)} onBlur={() => setTooltipLogoutOpened(false)}
            onMouseEnter={() => setTooltipLogoutOpened(true)} onMouseLeave={() => setTooltipLogoutOpened(false)}><ImExit size={23} style={{marginTop:"3px", marginLeft:"2px"}}/></ActionIcon>
        </Tooltip>        
        <ResetPasswordModal opened={changePasswordModal} onClose={() => setChangePasswordModal(false)} />
        <ResetModal opened={resetFiregexModal} onClose={() => setResetFiregexModal(false)} />
        <Space w="xl" />
  </Header>
}

export default HeaderPage;

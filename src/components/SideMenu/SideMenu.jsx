import React from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { Menu } from 'antd';
const items = [
  {
    key: '/',
    label: 'Planner',
  },
  {
    key: 'tasks',
    label: 'Tasks',
  },
  {
    key: 'habits',
    label: 'Habits',
  },
];
export const SideMenu = () => {
  const navigate = useNavigate()
  const onClick = ({key}) => {
      if (key === "signout") {
  //                TODO, sign out feature here"
      } else {
       navigate(key)
      }
  };
  return (<div style={{display: "flex"}}>
    <Menu
      style={{width: 256}}
      onClick={onClick}
      items={items}
    />
  </div>);
};


import React from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { Menu, Space } from 'antd';
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
export const SideMenu = ({ isInline = false }) => {
  const navigate = useNavigate()
  const onClick = ({key}) => {
      if (key === "signout") {
      
      } else {
       navigate(key)
      }
  };
  return (
    <Menu
      style={{backgroundColor: "#8EA4D2", color: 'white',}}
      mode={ isInline ? "inline" : "horizontal"}
      onClick={onClick}
      closable={false}
      items={items}
    />
    );
};


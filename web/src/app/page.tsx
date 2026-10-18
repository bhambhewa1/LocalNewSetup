"use client";

import Grid from '@mui/material/Grid'
import ListCards from '../views/dashboard/ListCards'
import { useEffect, useMemo, useState } from 'react'
import users from '../configs/user'
import type { usersType } from '../types/dashboard'
import AlertFeed from '../components/Alert'
import { io } from 'socket.io-client'
import InfoIcon from '@mui/icons-material/Info';


export default function Home() {
  const [search, setSearch] = useState("");
  const [getUsers, setUsers] = useState<usersType[]>([]);
  const [alerts, setAlerts] = useState<any[]>([])
  const [toggleIcon, setToggleIcon] = useState(true)


  //Socket connection for client side application
  useEffect(() => {
    const socket = io("http://localhost:8080");

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("alert", (msg) => {
      console.log(msg);
      setAlerts((prev) => [msg, ...prev].slice(0, 5));
    });

    return () => {
      socket.off("connect");
      socket.off("alert");
      socket.disconnect();
    };
  }, [])

  //fetch the user listing
  useEffect(() => {
    setUsers(users)
  }, [])

  useEffect(() => {
    const filteredUsers = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
      )

    })
    setUsers(filteredUsers)
  }, [search])

  return (
    <>
      {toggleIcon && <AlertFeed alerts={alerts} />}
      <div className={`flex justify-center items-center mt-5`}>
        <div className="flex text-center w-lg px-3 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white mb-4">
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-md outline-none placeholder:text-gray-400"
          />
        </div>
        <div className='ml-10 flex flex-row justify-center items-center cursor-pointer' onClick={() => setToggleIcon(!toggleIcon)}>
          <InfoIcon color="info" fontSize="large" />
          <h2 className="text-lg font-semibold mb-2 ml-2">Live Alerts</h2>
        </div>

      </div>
      <Grid container spacing={6}>
        {/* <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white mb-4"> */}

        <Grid size={{ xs: 12 }}>
          <ListCards dashboardData={getUsers} />
        </Grid>
      </Grid>
    </>
  )
}
'use client'

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import ListCards from '../views/dashboard/ListCards'
import { useEffect, useState } from 'react'
import users from '../configs/user'

export default function Home() {
  const [search, setSearch] = useState("");
  const [getUsers, setUsers] = useState([]);

  useEffect(() => {
    setUsers(users)
  }, [])

  useEffect(() => {
    const filteredUsers = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase()) ||
        user.department.toLowerCase().includes(search.toLowerCase())
      )

    })
    setUsers(filteredUsers)
  }, [search])

  return (
    <>
      <div className="flex justify-center items-center mt-5">
        <div className="flex text-center w-lg px-3 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white mb-4">
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-md outline-none placeholder:text-gray-400"
          />
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
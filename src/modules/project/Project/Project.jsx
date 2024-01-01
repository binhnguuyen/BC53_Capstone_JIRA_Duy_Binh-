import { Container } from '@mui/material'
import React from 'react'

const Project = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
      <Container style={{ maxWidth: "80vw" }} sx={{ margin: "60px 60px", padding: "24px", boxShadow: "0px 1px 10px 0px rgba(0,0,0,0.12)" }}>
        Project
      </Container>
    </div>
  )
}

export default Project
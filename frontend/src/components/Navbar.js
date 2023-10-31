import React from 'react'
import {Navbar, Container} from 'react-bootstrap';
import logo from '../gdm.png'

const navbar = () => {
    return (
        <Navbar bg="light"> 
        <Container>
            <Navbar.Brand>
                <div style={{display: 'flex', alignItems: 'left'}}>
                <img src={logo} width="30" height="30" alt="GDM logo" style={{marginLeft: '  '}}/>
                <div style={{marginLeft: "5px"}}> Rewriting Examples of Expert Tasks </div>
                </div>
            </Navbar.Brand>
        </Container>
        </Navbar>
    )
}

export default navbar
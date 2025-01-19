import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import sideImage from "@img/background.svg";
import planinLogo from "@img/welcome_5069460.png";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/home");
  };

  return (
    <Container
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
      }}
      disableGutters
    >
      <Grid container spacing={8}>
        <Grid item xs={12} md={7}>
          <Box>
            <img
              src={sideImage}
              alt="Imagem Lateral"
              style={{
                maxWidth: "110%",
                maxHeight: "100%",
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              height: "85%",
              width: "100%",
            }}
          >
            <Box
              component="img"
              src={planinLogo}
              alt="Logo"
              sx={{
                width: "50%",
                marginTop: "7rem",
              }}
            />
            <Grid item xs={10} md={5}>
            <Box
              sx={{
                padding: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button variant="contained" color="primary" style={{minWidth: "300px", fontSize: "17px" }} onClick={handleLogin}>
                Entrar na Klock-Store
              </Button>            
            </Box>
            </Grid>
            <Typography
                variant="h5"
                style={{
                  color: "#6357f1",
                  fontWeight: "bold",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                Organize seus pedidos com<br />
                mais facilidade e eficiência.
              </Typography> 
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
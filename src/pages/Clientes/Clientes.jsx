import React, { useState, useEffect } from "react";
import { Menu } from "@ui/Menu";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add"; // Importando o ícone de adicionar
import axios from "axios"; // Importando axios
import usuarioIcone from "@img/usuario-icone.png"; // Importando a imagem

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [isModalDetalhesAberto, setIsModalDetalhesAberto] = useState(false);
  const [isCarregando, setIsCarregando] = useState(true);
  const [indiceHovered, setIndiceHovered] = useState(null);
  const [isModalCadastroAberto, setIsModalCadastroAberto] = useState(false);
  const [novoCliente, setNovoCliente] = useState({ email: "", vip: false });

  useEffect(() => {
    const buscarClientes = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/clientes");
        const data = await response.json();
        setClientes(data);
        setIsCarregando(false);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        setIsCarregando(false);
      }
    };

    buscarClientes();
  }, []);

  const handleClickLinha = (cliente) => {
    setClienteSelecionado(cliente);
    setIsModalDetalhesAberto(true); // Abre o modal de detalhes ao clicar no cliente
  };

  const handleFecharModalDetalhes = () => {
    setIsModalDetalhesAberto(false);
  };

  const handleCardMouseEnter = (index) => {
    setIndiceHovered(index);
  };

  const handleCardMouseLeave = () => {
    setIndiceHovered(null);
  };

  const handleAbrirModalCadastro = () => {
    setIsModalCadastroAberto(true);
  };

  const handleFecharModalCadastro = () => {
    setIsModalCadastroAberto(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoCliente((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setNovoCliente((prev) => ({
      ...prev,
      vip: e.target.checked,
    }));
  };

  const handleCriarCliente = async () => {
    try {
      await axios.post("http://localhost:8080/api/clientes", novoCliente);
      setClientes((prev) => [...prev, novoCliente]); // Atualiza a lista de clientes
      setIsModalCadastroAberto(false); // Fecha o modal
      setNovoCliente({ email: "", vip: false }); // Limpa o formulário
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
    }
  };

  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} mt={-2} ml={0}>
        <Menu />
        <Grid item xs={10.3} sx={{ textAlign: "right" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "#6157bb", // Cor de fundo
              "&:hover": { backgroundColor: "#8889b1" }, // Cor ao passar o mouse
              marginTop: "1rem",
            }}
            onClick={handleAbrirModalCadastro} // Abre o modal de cadastro
          >
            <AddIcon sx={{ marginRight: "8px" }} /> Criar Cliente
          </Button>
        </Grid>
      </Grid>

    {isCarregando ? (
      <div style={{ textAlign: "center", marginTop: "10rem" }}>
        <Typography variant="h4" style={{ marginBottom: "10px" }}>
          Carregando...
        </Typography>
        <CircularProgress />
      </div>
    ) : clientes.length === 0 ? (
      <div style={{ textAlign: "center", marginTop: "10rem" }}>
          <Typography variant="h5" style={{ marginBottom: "1rem", fontWeight: "bold" }}>
            Não há clientes disponíveis. <br />
            Cadastre um novo cliente!
          </Typography>
      </div>
    ) : (
      <Paper
        style={{
          width: "70rem",
          padding: "20px",
          marginTop: "3rem",
        }}
      >
        <Grid container spacing={5} justifyContent="center">
          {clientes.map((cliente, index) => (
            <Grid key={cliente.id} item xs={10} sm={6} md={4} lg={4}>
              <Paper
                onMouseEnter={() => handleCardMouseEnter(index)}
                onMouseLeave={handleCardMouseLeave}
                style={{
                  borderRadius: "1rem",
                  backgroundColor: "#edecf5",
                  transition:
                    "transform 0.3s ease-in-out, background-color 0.3s, color 0.3s",
                  transform: indiceHovered === index ? "scale(1.15)" : "scale(1)",
                  color: indiceHovered === index ? "#000" : "#6357F1",
                }}
              >
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow></TableRow>
                    </TableHead>
                    <TableRow onClick={() => handleClickLinha(cliente)}>
                      <TableCell
                        style={{
                          color: "#6357F1",
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={usuarioIcone}
                          alt="Ícone do Usuário"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            marginRight: "10px",
                          }}
                        />
                        <Typography
                          variant="body2"
                          style={{ fontWeight: "bold" }}
                        >
                          {cliente.email}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    )}


      {/* Modal para exibir detalhes do cliente */}
      <Modal open={isModalDetalhesAberto} onClose={handleFecharModalDetalhes}>
        <Paper
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "40px",
            borderRadius: "1rem",
          }}
        >
          <Typography
            variant="h5"
            style={{ textAlign: "center", marginBottom: "2rem", fontWeight: "bold" }}
          >
            Detalhes do Cliente
          </Typography>
          {clienteSelecionado && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>VIP</TableCell>
                  </TableRow>
                </TableHead>
                <TableRow>
                  <TableCell>{clienteSelecionado.id}</TableCell>
                  <TableCell>{clienteSelecionado.email}</TableCell>
                  <TableCell>{clienteSelecionado.vip ? "Sim" : "Não"}</TableCell>
                </TableRow>
              </Table>
            </TableContainer>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleFecharModalDetalhes}
            style={{ marginTop: "1rem" }}
          >
            Fechar
          </Button>
        </Paper>
      </Modal>

      {/* Modal para cadastro de cliente */}
      <Modal open={isModalCadastroAberto} onClose={handleFecharModalCadastro}>
        <Paper
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "40px",
            borderRadius: "1rem",
          }}
        >
          <Typography
            variant="h5"
            style={{ textAlign: "center", marginBottom: "2rem", fontWeight: "bold" }}
          >
            Cadastrar Cliente
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            name="email"
            value={novoCliente.email}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="checkbox"
              checked={novoCliente.vip}
              onChange={handleCheckboxChange}
              style={{ marginRight: "8px" }}
            />
            <label>VIP</label>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCriarCliente}
          >
            Criar Cliente
          </Button>
        </Paper>
      </Modal>
    </Grid>
  );
};

export default Clientes;

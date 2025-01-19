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
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add"; // Ícone para adicionar cliente
import axios from "axios"; // Axios para requisições HTTP
import usuarioIcone from "@img/usuario-icone.png"; // Ícone de usuário

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [isModalDetalhesAberto, setIsModalDetalhesAberto] = useState(false);
  const [isCarregando, setIsCarregando] = useState(true);
  const [indiceHovered, setIndiceHovered] = useState(null);
  const [isModalCadastroAberto, setIsModalCadastroAberto] = useState(false);
  const [isModalEditarAberto, setIsModalEditarAberto] = useState(false); // Novo estado para o modal de edição
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

  const handleAbrirModalCadastro = () => {
    setIsModalCadastroAberto(true);
  };

  const handleFecharModalCadastro = () => {
    setIsModalCadastroAberto(false);
  };

  const handleAbrirModalEditar = () => {
    setIsModalEditarAberto(true);
    setNovoCliente(clienteSelecionado);  // Passa os dados do cliente selecionado para o estado de edição
  };

  const handleFecharModalEditar = () => {
    setIsModalEditarAberto(false);
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

  const handleRemoverCliente = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/clientes/${id}`);
      setClientes((prevClientes) => prevClientes.filter((cliente) => cliente.id !== id)); // Atualiza a lista de clientes
      setIsModalDetalhesAberto(false); // Fecha o modal após a remoção
    } catch (error) {
      console.error("Erro ao remover cliente:", error);
    }
  };

  const handleEditarCliente = async () => {
    try {
      // Dados de exemplo para a edição
      const clienteAtualizado = {
        email: clienteSelecionado.email,
        vip: clienteSelecionado.vip,
      };

      await axios.put(`http://localhost:8080/api/clientes/${clienteSelecionado.id}`, clienteAtualizado);

      // Atualiza a lista de clientes com o cliente editado
      setClientes((prevClientes) =>
        prevClientes.map((cliente) =>
          cliente.id === clienteSelecionado.id ? { ...cliente, ...clienteAtualizado } : cliente
        )
      );
      setIsModalEditarAberto(false); // Fecha o modal após a edição
    } catch (error) {
      console.error("Erro ao editar cliente:", error);
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
                  onMouseEnter={() => setIndiceHovered(index)}
                  onMouseLeave={() => setIndiceHovered(null)}
                  style={{
                    borderRadius: "1rem",
                    backgroundColor: "#edecf5",
                    transition: "transform 0.3s ease-in-out",
                    transform: indiceHovered === index ? "scale(1.15)" : "scale(1)",
                    color: "#6357F1",
                  }}
                >
                  <TableContainer>
                    <Table>
                      <TableRow onClick={() => handleClickLinha(cliente)}>
                        <TableCell style={{ textAlign: "center" }}>
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
                          <Typography variant="body2" style={{ fontWeight: "bold" }}>
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
            <>
              <TableContainer>
                <Table>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>{clienteSelecionado.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>{clienteSelecionado.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>VIP</TableCell>
                    <TableCell>{clienteSelecionado.vip ? "Sim" : "Não"}</TableCell>
                  </TableRow>
                </Table>
              </TableContainer>

              {/* Botões de Editar e Remover visíveis apenas quando o modal de detalhes estiver aberto */}
              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ marginRight: "1rem" }}
                  onClick={handleAbrirModalEditar} // Abre o modal de edição
                >
                  Editar
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  style={{
                    marginLeft: "1rem",
                    color: "#ff0000",
                    borderColor: "#ff0000",
                  }}
                  onClick={() => handleRemoverCliente(clienteSelecionado.id)} // Função para remover o cliente
                >
                  Remover
                </Button>
              </div>
            </>
          )}
        </Paper>
      </Modal>

      {/* Modal para edição do cliente */}
      <Modal open={isModalEditarAberto} onClose={handleFecharModalEditar}>
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
            Editar Cliente
          </Typography>
          {clienteSelecionado && (
            <>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={clienteSelecionado.email || ""}
                onChange={(e) =>
                  setClienteSelecionado({ ...clienteSelecionado, email: e.target.value })
                }
                style={{ marginBottom: "1rem" }}
              />
              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="checkbox"
                  checked={clienteSelecionado.vip || false}
                  onChange={(e) =>
                    setClienteSelecionado({ ...clienteSelecionado, vip: e.target.checked })
                  }
                />
                <label>VIP</label>
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditarCliente}
              >
                Atualizar Cliente
              </Button>
            </>
          )}
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
            fullWidth
            value={novoCliente.email}
            onChange={handleInputChange}
            name="email"
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

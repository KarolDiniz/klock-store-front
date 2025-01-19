import React, { useState, useEffect } from "react"; 
import { Menu } from "@ui/Menu";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";  
import DeleteIcon from "@mui/icons-material/Delete"; 
import EditIcon from "@mui/icons-material/Edit"; // Importando o ícone de editar

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal de edição
  const [pedidoEditado, setPedidoEditado] = useState(null); // Estado para armazenar o pedido a ser editado
  const [erro, setErro] = useState("");

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/pedidos"); 
        const data = await response.json();
        setPedidos(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        setIsLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const handleCreatePedido = async () => {
    if (!novoPedido.cliente.id || novoPedido.items.length === 0) {
      setErro("Por favor, preencha todos os campos corretamente.");
      return;
    }

    const response = await fetch("http://localhost:8080/api/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoPedido),
    });

    if (response.ok) {
      const pedidoCriado = await response.json();
      setPedidos((prevPedidos) => [...prevPedidos, pedidoCriado]);
      setIsCreateModalOpen(false);
      setErro("");
      alert("Pedido criado com sucesso!");
    } else {
      alert("Falha ao criar pedido.");
    }
  };

  const handleEditPedido = (pedido) => {
    setPedidoEditado(pedido);
    setIsEditModalOpen(true);
  };

  const handleUpdatePedido = async () => {
    if (!pedidoEditado.cliente.id || pedidoEditado.items.length === 0) {
      setErro("Por favor, preencha todos os campos corretamente.");
      return;
    }

    const response = await fetch(`http://localhost:8080/api/pedidos/${pedidoEditado.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pedidoEditado),
    });

    if (response.ok) {
      const pedidoAtualizado = await response.json();
      setPedidos((prevPedidos) => 
        prevPedidos.map((pedido) => 
          pedido.id === pedidoAtualizado.id ? pedidoAtualizado : pedido
        )
      );
      setIsEditModalOpen(false);
      alert("Pedido atualizado com sucesso!");
    } else {
      alert("Falha ao atualizar pedido.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "cliente.id") {
      setPedidoEditado((prevState) => ({
        ...prevState,
        cliente: { ...prevState.cliente, id: parseInt(value, 10) },
      }));
    } else {
      setPedidoEditado({
        ...pedidoEditado,
        [name]: value,
      });
    }
  };

  const handleItemInputChange = (index, value) => {
    const updatedItems = [...pedidoEditado.items];
    updatedItems[index] = { id: parseInt(value, 10) };
    setPedidoEditado({
      ...pedidoEditado,
      items: updatedItems,
    });
  };

  const handleRemoverPedido = async (pedidoId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/pedidos/${pedidoId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPedidos(pedidos.filter((pedido) => pedido.id !== pedidoId));
        alert("Pedido excluído com sucesso!");
      } else {
        alert("Falha ao excluir pedido.");
      }
    } catch (error) {
      console.error("Erro ao excluir pedido:", error);
      alert("Erro ao excluir pedido.");
    }
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12}>
        <Menu />
      </Grid>

      <Grid item xs={10.5} sx={{ textAlign: "right", marginBottom: "1rem" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsCreateModalOpen(true)}
          sx={{
            backgroundColor: "#6157bb",
            "&:hover": { backgroundColor: "#8889b1" },
            padding: "10px 20px",
            fontSize: "16px",
            textTransform: "none",
          }}
        >
          <AddIcon sx={{ marginRight: "8px" }} /> Criar Pedido
        </Button>
      </Grid>

      {isLoading ? (
        <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
          <Typography variant="h5" sx={{ marginBottom: "10px" }}>
            Carregando...
          </Typography>
          <CircularProgress sx={{ color: "#6157bb" }} />
        </Box>
      ) : pedidos.length === 0 ? (
        <Box sx={{ textAlign: "center", marginTop: "10rem" }}>
          <Typography variant="h5" style={{ marginBottom: "1rem", fontWeight: "bold" }}>
            Não há pedidos disponíveis. <br />
            Cadastre um novo pedido!
          </Typography>
        </Box>
      ) : (
        <Grid item xs={10.5}>
          <TableContainer component={Paper} sx={{ borderRadius: "8px", boxShadow: 3 }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Itens</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Total com Desconto</TableCell>
                  <TableCell>Status de Estoque</TableCell>
                  <TableCell>Data de Entrega</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pedidos.map((pedido) => (
                  <TableRow key={pedido.id} sx={{ "&:hover": { backgroundColor: "#f0f0f0" } }}>
                    <TableCell>{pedido.id}</TableCell>
                    <TableCell>
                      {pedido.cliente.id} - {pedido.cliente.email}{" "}
                      {pedido.cliente.vip && "(VIP)"}
                    </TableCell>
                    <TableCell>
                      {pedido.items.map((item, index) => (
                        <div key={index}>
                          {item.nome} (Qtd: {item.quantidade}) - R$ {item.preco}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>R$ {pedido.total}</TableCell>
                    <TableCell>R$ {pedido.totalComDesconto}</TableCell>
                    <TableCell>
                      {pedido.emEstoque ? "Em Estoque" : "Fora de Estoque"}
                    </TableCell>
                    <TableCell>
                      {new Date(pedido.dataEntrega).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        color="secondary"
                        onClick={() => handleRemoverPedido(pedido.id)} 
                        sx={{ marginLeft: "1rem" }}
                      >
                        <DeleteIcon sx={{ color: "#9754e4" }} />
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => handleEditPedido(pedido)} 
                        sx={{ marginLeft: "1rem" }}
                      >
                        <EditIcon sx={{ color: "#9754e4" }} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}

      {/* Modal de Edição */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            borderRadius: "1rem",
            width: "400px",
            backgroundColor: "#fff",
            boxShadow: 24,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h5" sx={{ textAlign: "center", marginBottom: "1.5rem" }}>
            Editar Pedido
          </Typography>

          {erro && (
            <Typography variant="body2" color="error" sx={{ textAlign: "center", marginBottom: "1rem" }}>
              {erro}
            </Typography>
          )}

          <TextField
            label="ID do Cliente"
            variant="outlined"
            name="cliente.id"
            type="number"
            value={pedidoEditado?.cliente.id || ""}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: "1rem" }}
          />

          {pedidoEditado?.items.map((item, index) => (
            <TextField
              key={index}
              label={`ID do Item ${index + 1}`}
              variant="outlined"
              value={item.id}
              onChange={(e) => handleItemInputChange(index, e.target.value)}
              fullWidth
              sx={{ marginBottom: "1rem" }}
            />
          ))}

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdatePedido}
            fullWidth
            sx={{
              marginTop: "1rem",
              padding: "10px 0",
              fontSize: "16px",
            }}
          >
            Atualizar Pedido
          </Button>

          <Button
            variant="outlined"
            onClick={() => setIsEditModalOpen(false)}
            sx={{
              marginTop: "1rem",
              padding: "10px 0",
              fontSize: "16px",
              width: "100%",
            }}
          >
            Cancelar
          </Button>
        </Paper>
      </Modal>
    </Grid>
  );
};

export default Pedidos;

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
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";  // Importando o ícone de adicionar


const Produto = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [isModalDetalhesAberto, setIsModalDetalhesAberto] = useState(false);
  const [isModalCriarAberto, setIsModalCriarAberto] = useState(false);
  const [valorFiltro, setValorFiltro] = useState("");
  const [isCarregando, setIsCarregando] = useState(true);
  const [indiceHovered, setIndiceHovered] = useState(null);

  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    preco: "",
    quantidade: "",
    estoque: "",
  });

  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/itens");
        const data = await response.json();
        setProdutos(data);
        setIsCarregando(false);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setIsCarregando(false);
      }
    };

    buscarProdutos();
  }, []);

  const handleClickLinha = (produto) => {
    setProdutoSelecionado(produto);
    setIsModalDetalhesAberto(true); // Abre o modal de detalhes ao clicar no produto
  };

  const handleFecharModalDetalhes = () => {
    setIsModalDetalhesAberto(false);
  };

  const handleFecharModalCriar = () => {
    setIsModalCriarAberto(false);
  };

  const handleAlterarFiltro = (event) => {
    setValorFiltro(event.target.value);
  };

  const handleRemoverProduto = () => {
    setProdutos((produtosAnteriores) =>
      produtosAnteriores.filter((produto) => produto.id !== produtoSelecionado.id)
    );
    handleFecharModalDetalhes();
  };

  const handleCardMouseEnter = (index) => {
    setIndiceHovered(index);
  };

  const handleCardMouseLeave = () => {
    setIndiceHovered(null);
  };

  const produtosFiltrados = produtos.filter((produto) =>
    (produto.nome || "").toLowerCase().includes(valorFiltro.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoProduto({
      ...novoProduto,
      [name]: value,
    });
  };

  const handleCriarProduto = async () => {
    const response = await fetch("http://localhost:8080/api/itens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoProduto),
    });

    if (response.ok) {
      const produtoCriado = await response.json();
      setProdutos((produtosAnteriores) => [...produtosAnteriores, produtoCriado]);
      setNovoProduto({
        nome: "",
        preco: "",
        quantidade: "",
        estoque: "",
      });
      alert("Produto criado com sucesso!");
    } else {
      alert("Falha ao criar produto.");
    }
  };

  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} mt={-5} ml={-0.5}>
        <Menu />
        <TextField
          label="Filtrar por Nome"
          variant="outlined"
          value={valorFiltro}
          onChange={handleAlterarFiltro}
          style={{
            marginBottom: "16px",
            marginLeft: "11.5rem", 
          }}
        />
         <Grid item xs={10.3} sx={{ textAlign: "right" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsModalCriarAberto(true)} 
          sx={{
            backgroundColor: "#6157bb", 
            "&:hover": { backgroundColor: "#8889b1" }, 
            marginTop: "-5rem",
          }}
        >
          <AddIcon sx={{ marginRight: "8px" }} /> Criar Produto
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
) : produtosFiltrados.length === 0 ? (
  <Typography
    variant="h5"
    style={{
      textAlign: "center",
      marginTop: "10rem",
      fontWeight: "bold",
      color: "#6357F1",
    }}
  >
    Não há produtos disponíveis. <br /> 
    Cadastre um novo produto!
  </Typography>
) : (
  <Paper
    style={{
      marginTop: "3rem",
      width: "70rem",
      padding: "20px",
    }}
  >
    <Grid container spacing={5} justifyContent="center" alignItems="center">
      {produtosFiltrados.map((produto, index) => (
        <Grid key={produto.id} item xs={12} lg={3}>
          <Paper
            onMouseEnter={() => handleCardMouseEnter(index)}
            onMouseLeave={handleCardMouseLeave}
            style={{
              overflow: "hidden",
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
                <TableRow onClick={() => handleClickLinha(produto)}>
                  <TableCell
                    style={{
                      color: "#6357F1",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body2" style={{ fontWeight: "bold" }}>
                      {produto.nome}
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={
                          produto.image_url ||
                          "src/assets/img/package-box_6046583.png"
                        }
                        alt={produto.nome}
                        style={{ maxWidth: "100%", maxHeight: "100%" }}
                      />
                    </div>
                    <Typography variant="body2" style={{ marginTop: "1rem" }}>
                      <strong>Preço:</strong> R$ {produto.preco}
                    </Typography>
                    <Typography variant="body2" style={{ marginTop: "1rem" }}>
                      <strong>Quantidade:</strong> {produto.quantidade}
                    </Typography>
                    <Typography variant="body2" style={{ marginTop: "1rem" }}>
                      <strong>Estoque:</strong> {produto.estoque}
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
            Detalhes do Produto
          </Typography>
          {produtoSelecionado && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Preço</TableCell>
                    <TableCell>Quantidade</TableCell>
                    <TableCell>Estoque</TableCell>
                  </TableRow>
                </TableHead>
                <TableRow>
                  <TableCell>{produtoSelecionado.id}</TableCell>
                  <TableCell>{produtoSelecionado.nome}</TableCell>
                  <TableCell>{produtoSelecionado.preco}</TableCell>
                  <TableCell>{produtoSelecionado.quantidade}</TableCell>
                  <TableCell>{produtoSelecionado.estoque}</TableCell>
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
          <Button
            variant="outlined"
            onClick={handleRemoverProduto}
            style={{
              marginTop: "1rem",
              color: "#ff0000",
              borderColor: "#ff0000",
              marginLeft: "20rem",
            }}
          >
            Remover
          </Button>
        </Paper>
      </Modal>

      {/* Modal para criar novo produto */}
      <Modal open={isModalCriarAberto} onClose={handleFecharModalCriar}>
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
            style={{ marginBottom: "1rem", fontWeight: "bold" }}
          >
            Criar Produto
          </Typography>
          <TextField
            label="Nome do Produto"
            variant="outlined"
            name="nome"
            value={novoProduto.nome}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            label="Preço"
            variant="outlined"
            name="preco"
            type="number"
            value={novoProduto.preco}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            label="Quantidade"
            variant="outlined"
            name="quantidade"
            type="number"
            value={novoProduto.quantidade}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <TextField
            label="Estoque"
            variant="outlined"
            name="estoque"
            type="number"
            value={novoProduto.estoque}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: "1rem" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCriarProduto}
            fullWidth
          >
            Criar
          </Button>
          <Button
            variant="outlined"
            onClick={handleFecharModalCriar}
            style={{ marginTop: "1rem", width: "100%" }}
          >
            Cancelar
          </Button>
        </Paper>
      </Modal>
    </Grid>
  );
};

export default Produto;

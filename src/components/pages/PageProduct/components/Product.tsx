import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { formatAsPrice } from "~/utils/utils";
import AddProductToCart from "~/components/AddProductToCart/AddProductToCart";
import { useProductById } from "~/queries/products";
import { useParams } from "react-router-dom";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const { data = {id: null} , isLoading } = useProductById(id);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if(!data.id) {
    return <Typography>Product not found</Typography>;
  }

  return (
    <Grid container spacing={4}>
        <Grid item key={data.id} xs={12} sm={6} md={4}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardMedia
              sx={{ pt: "56.25%" }}
              image={`https://source.unsplash.com/random?sig=${data.id}`}
              title="Image title"
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                {data.title}
              </Typography>
              <Typography>{formatAsPrice(data.price)}</Typography>
            </CardContent>
            <CardActions>
              <AddProductToCart product={data} />
            </CardActions>
          </Card>
        </Grid>
    </Grid>
  );
}

import { NextPage } from "next"
import { Close } from "@mui/icons-material";
import { MainLayout } from "../components"

const Custom500: NextPage = () => {
  return (
    <MainLayout title="Página no encontrada" pageDescription="La página que buscas no existe en MPR." nextPage="/" titleIcon={ <Close color='info' sx={{ fontSize: '1.5rem' }} /> } url='/'>
        <h2>Vaya, ¡ocurrió un error buscando la página que querías!</h2>
    </MainLayout>
  )
}

export default Custom500;
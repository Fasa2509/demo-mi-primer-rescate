import { NextPage } from "next"
import Close from "@mui/icons-material/Close";
import { MainLayout } from "../components"

const Custom404: NextPage = () => {
  return (
    <MainLayout title="Página no encontrada" pageDescription="La página que buscas no existe en MPR." nextPage="/" titleIcon={ <Close color='info' sx={{ fontSize: '1.5rem' }} /> } url='/'>
        <h2>Vaya, ¡parece que te perdiste! ¿Necesitas ayuda?</h2>
    </MainLayout>
  )
}

export default Custom404;
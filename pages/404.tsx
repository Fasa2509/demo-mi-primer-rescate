import { NextPage } from "next"
import { MainLayout } from "../components"

const Custom404: NextPage = () => {
  return (
    <MainLayout title="Página no encontrada" pageDescription="La página que buscas no existe.">
        <h2>Vaya, ¡parece que te perdiste! ¿Necesitas ayuda?</h2>
    </MainLayout>
  )
}

export default Custom404
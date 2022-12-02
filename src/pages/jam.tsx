import MainLayout from "@fet/layouts/MainLayout"
import JamProductionList from "../sections/JamProductionsList"
import IntegratedUserHeader from "../sections/IntegratedUserHeader"

export default function JamPage() {
  return (
    <MainLayout flow="column" protection="discord">
      <IntegratedUserHeader />
      <JamProductionList />
    </MainLayout>
  )
}

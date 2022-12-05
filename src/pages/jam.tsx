import MainLayout from "@fet/layouts/MainLayout"
import DiscordIntegrationProtection from "@fet/discordIntegration/DiscordIntegrationProtection"
import JamProductionList from "../sections/JamProductionsList"
import IntegratedUserHeader from "../sections/IntegratedUserHeader"

export default function JamPage() {
  return (
    <MainLayout flow="column">
      <DiscordIntegrationProtection>
        <IntegratedUserHeader />
      </DiscordIntegrationProtection>
      <JamProductionList />
    </MainLayout>
  )
}

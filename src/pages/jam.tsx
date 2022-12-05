import MainLayout from "@fet/layouts/MainLayout"
import { IntegratedUserContextProvider } from "@fet/discordIntegration/IntegratedUserContext"
import DiscordLinking from "@fet/discordIntegration/DiscordLinking"
import DiscordIntegrationProtection from "@fet/discordIntegration/DiscordIntegrationProtection"
import JamProductionList from "../sections/JamProductionsList"
import IntegratedUserHeader from "../sections/IntegratedUserHeader"

export default function JamPage() {
  return (
    <MainLayout flow="column">
      <IntegratedUserContextProvider>
        <DiscordIntegrationProtection fallback={<DiscordLinking />}>
          <IntegratedUserHeader />
        </DiscordIntegrationProtection>

        <JamProductionList />
      </IntegratedUserContextProvider>
    </MainLayout>
  )
}

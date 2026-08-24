import Session, { type SessionData } from './Session'

let currentSession = $state<undefined | null | SessionData>( undefined )
let pendingSession:undefined | null | Promise<null | SessionData> = undefined

export const auth = {
  get session() {
    return currentSession;
  },

  async loadSession() {
    if (pendingSession !== undefined) return pendingSession;

    const session = Session.get();

    pendingSession = !session ? session : session.then((data) => {
      currentSession = data;
      if (data) Session.resetExpirationTimer();
      return data;
    });

    if (!pendingSession) {
      currentSession = pendingSession;
    }

    return pendingSession;
  },

  getDiscordIntegrationLink() {
    return `https://discord.com/oauth2/authorize`
      + `?client_id=379234773408677888`
      + `&redirect_uri=${encodeURIComponent( location.origin )}`
      + `&response_type=code`
      + `&scope=identify`
      // + `&prompt=none`
  },

  setSession( data:null | SessionData ) {
    currentSession = data;
    if (!data) pendingSession = data;
  },

  async login( code:string ) {
    this.setSession( await Session.create( code ) )
  },

  async logout() {
    await Session.delete()
    this.setSession( null )
  },
}

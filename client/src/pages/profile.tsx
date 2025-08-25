import { useAuth } from "@/contexts/AuthContext"
import { useLocation } from "wouter"
import { useEffect, useState } from "react"
import Nav from "@/components/nav"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  User, 
  Users, 
  Guild, 
  Youtube, 
  Instagram, 
  Twitter, 
  Twitch,
  Plus, 
  Trash2, 
  Save,
  Edit,
  Shield,
  Globe
} from "lucide-react"
import { motion } from "framer-motion"

interface Squad {
  id: string
  name: string
  playerIds: string[]
}

export default function Profile() {
  const { user, loading } = useAuth()
  const [, navigate] = useLocation()
  const { toast } = useToast()

  // Profile state
  const [guildName, setGuildName] = useState("")
  const [youtubeLink, setYoutubeLink] = useState("")
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    twitter: "",
    twitch: "",
    discord: ""
  })

  // Squad management state
  const [squads, setSquads] = useState<Squad[]>([
    { id: "1", name: "", playerIds: ["", "", "", ""] }
  ])

  // Edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingSquads, setIsEditingSquads] = useState(false)
  const [isEditingSocials, setIsEditingSocials] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login")
      } else if (user && !user.role) {
        navigate("/role-selection")
      }
    }
  }, [user, loading, navigate])

  const addSquad = () => {
    const newSquad: Squad = {
      id: Date.now().toString(),
      name: "",
      playerIds: ["", "", "", ""]
    }
    setSquads([...squads, newSquad])
  }

  const removeSquad = (squadId: string) => {
    setSquads(squads.filter(squad => squad.id !== squadId))
  }

  const updateSquadName = (squadId: string, name: string) => {
    setSquads(squads.map(squad => 
      squad.id === squadId ? { ...squad, name } : squad
    ))
  }

  const updateSquadPlayer = (squadId: string, playerIndex: number, playerId: string) => {
    setSquads(squads.map(squad => 
      squad.id === squadId 
        ? { 
            ...squad, 
            playerIds: squad.playerIds.map((id, index) => 
              index === playerIndex ? playerId : id
            )
          }
        : squad
    ))
  }

  const saveProfile = () => {
    // Mock save - in real app, API call
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    })
    setIsEditingProfile(false)
  }

  const saveSquads = () => {
    // Mock save - in real app, API call
    toast({
      title: "Squads Updated",
      description: "Your squad information has been saved successfully.",
    })
    setIsEditingSquads(false)
  }

  const saveSocials = () => {
    // Mock save - in real app, API call
    toast({
      title: "Social Links Updated",
      description: "Your social media links have been saved successfully.",
    })
    setIsEditingSocials(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !user.role) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-dark-bg font-mono mb-4">
            PLAYER PROFILE
          </h1>
          <p className="text-lg text-gray-600">
            Welcome back, <span className="font-bold text-primary-orange">{user.username}</span>!
          </p>
          <Badge variant="secondary" className="mt-2 capitalize">
            <Shield className="w-4 h-4 mr-1" />
            {user.role}
          </Badge>
        </div>

        {/* Profile Information */}
        <section>
          <Card className="border-2 border-black">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-orange flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="font-mono">PROFILE INFORMATION</CardTitle>
                    <CardDescription>Manage your gaming profile</CardDescription>
                  </div>
                </div>
                <Button
                  onClick={() => isEditingProfile ? saveProfile() : setIsEditingProfile(true)}
                  className="font-mono"
                  variant={isEditingProfile ? "default" : "outline"}
                >
                  {isEditingProfile ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                  {isEditingProfile ? "SAVE" : "EDIT"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="font-mono">USERNAME</Label>
                  <Input
                    id="username"
                    value={user.username}
                    disabled
                    className="bg-gray-50 font-mono"
                    data-testid="input-username"
                  />
                  <p className="text-sm text-gray-500">Username cannot be changed</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="guild" className="font-mono">GUILD NAME</Label>
                  <Input
                    id="guild"
                    value={guildName}
                    onChange={(e) => setGuildName(e.target.value)}
                    disabled={!isEditingProfile}
                    placeholder="Enter your guild name"
                    className="font-mono"
                    data-testid="input-guild-name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube" className="font-mono flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-500" />
                  YOUTUBE CHANNEL
                </Label>
                <Input
                  id="youtube"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  disabled={!isEditingProfile}
                  placeholder="https://youtube.com/@yourchannel"
                  className="font-mono"
                  data-testid="input-youtube-link"
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Squad Management */}
        <section>
          <Card className="border-2 border-black">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-black flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="font-mono">SQUAD MANAGEMENT</CardTitle>
                    <CardDescription>Manage your Free Fire squads and team members</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isEditingSquads && (
                    <Button
                      onClick={addSquad}
                      variant="outline"
                      size="sm"
                      className="font-mono"
                      data-testid="button-add-squad"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      ADD SQUAD
                    </Button>
                  )}
                  <Button
                    onClick={() => isEditingSquads ? saveSquads() : setIsEditingSquads(true)}
                    className="font-mono"
                    variant={isEditingSquads ? "default" : "outline"}
                  >
                    {isEditingSquads ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                    {isEditingSquads ? "SAVE" : "EDIT"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {squads.map((squad, squadIndex) => (
                  <motion.div
                    key={squad.id}
                    className="border-2 border-gray-200 p-6 bg-gray-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: squadIndex * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-mono font-bold">SQUAD #{squadIndex + 1}</h4>
                      {isEditingSquads && squads.length > 1 && (
                        <Button
                          onClick={() => removeSquad(squad.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="font-mono">SQUAD NAME</Label>
                        <Input
                          value={squad.name}
                          onChange={(e) => updateSquadName(squad.id, e.target.value)}
                          disabled={!isEditingSquads}
                          placeholder="Enter squad name"
                          className="mt-1 font-mono"
                          data-testid={`input-squad-name-${squadIndex}`}
                        />
                      </div>
                      
                      <div>
                        <Label className="font-mono">PLAYER IDs</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                          {squad.playerIds.map((playerId, playerIndex) => (
                            <Input
                              key={playerIndex}
                              value={playerId}
                              onChange={(e) => updateSquadPlayer(squad.id, playerIndex, e.target.value)}
                              disabled={!isEditingSquads}
                              placeholder={`Player ${playerIndex + 1} ID`}
                              className="font-mono"
                              data-testid={`input-player-${squadIndex}-${playerIndex}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Social Media Links */}
        <section>
          <Card className="border-2 border-black">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="font-mono">SOCIAL MEDIA LINKS</CardTitle>
                    <CardDescription>Connect your social media profiles</CardDescription>
                  </div>
                </div>
                <Button
                  onClick={() => isEditingSocials ? saveSocials() : setIsEditingSocials(true)}
                  className="font-mono"
                  variant={isEditingSocials ? "default" : "outline"}
                >
                  {isEditingSocials ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                  {isEditingSocials ? "SAVE" : "EDIT"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="font-mono flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-500" />
                    INSTAGRAM
                  </Label>
                  <Input
                    id="instagram"
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                    disabled={!isEditingSocials}
                    placeholder="https://instagram.com/username"
                    className="font-mono"
                    data-testid="input-instagram"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter" className="font-mono flex items-center gap-2">
                    <Twitter className="w-4 h-4 text-blue-400" />
                    TWITTER
                  </Label>
                  <Input
                    id="twitter"
                    value={socialLinks.twitter}
                    onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                    disabled={!isEditingSocials}
                    placeholder="https://twitter.com/username"
                    className="font-mono"
                    data-testid="input-twitter"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitch" className="font-mono flex items-center gap-2">
                    <Twitch className="w-4 h-4 text-purple-500" />
                    TWITCH
                  </Label>
                  <Input
                    id="twitch"
                    value={socialLinks.twitch}
                    onChange={(e) => setSocialLinks(prev => ({ ...prev, twitch: e.target.value }))}
                    disabled={!isEditingSocials}
                    placeholder="https://twitch.tv/username"
                    className="font-mono"
                    data-testid="input-twitch"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discord" className="font-mono flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-500" />
                    DISCORD
                  </Label>
                  <Input
                    id="discord"
                    value={socialLinks.discord}
                    onChange={(e) => setSocialLinks(prev => ({ ...prev, discord: e.target.value }))}
                    disabled={!isEditingSocials}
                    placeholder="https://discord.gg/serverlink"
                    className="font-mono"
                    data-testid="input-discord"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <section>
          <Card className="border-2 border-primary-orange bg-gradient-to-r from-primary-orange/10 to-secondary-orange/10">
            <CardHeader>
              <CardTitle className="font-mono text-center">QUICK ACTIONS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate("/dashboard")}
                  className="bg-white text-black hover:bg-gray-100 font-mono border-2 border-black"
                  data-testid="button-browse-tournaments"
                >
                  <Users className="w-5 h-5 mr-2" />
                  BROWSE TOURNAMENTS
                </Button>
                <Button 
                  onClick={() => navigate("/statistics")}
                  className="bg-black text-white hover:bg-gray-800 font-mono"
                  data-testid="button-view-stats"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  VIEW STATISTICS
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  )
}
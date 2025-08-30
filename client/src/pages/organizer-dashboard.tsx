import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/AuthContext"
import Nav from "@/components/nav"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Trophy, 
  Users, 
  DollarSign, 
  Search, 
  Filter, 
  Download,
  User,
  Shield,
  Calendar,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import { format } from "date-fns"
import { apiRequest } from "@/lib/queryClient"

interface EnhancedRegistration {
  id: string
  tournamentId: string
  userId: string
  teamName: string
  iglRealName: string
  iglIngameId: string
  playerNames: string[] | null
  registrationFee: number
  paymentStatus: string
  paymentMethod: string | null
  registeredAt: string
  tournament: {
    id: string
    name: string
    gameMode: string
    type: string
    prizePool: number
  }
}

export default function OrganizerDashboard() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [gameFilter, setGameFilter] = useState("all")

  const { data: registrations, isLoading } = useQuery<EnhancedRegistration[]>({
    queryKey: ["/api/organizer", user?.id, "registrations"],
    enabled: !!user?.id,
  })

  const filteredRegistrations = registrations?.filter(reg => {
    const matchesSearch = 
      reg.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.iglRealName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.iglIngameId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || reg.paymentStatus === statusFilter
    const matchesGame = gameFilter === "all" || reg.tournament.gameMode === gameFilter
    
    return matchesSearch && matchesStatus && matchesGame
  }) || []

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getGameModeDisplay = (gameMode: string) => {
    return gameMode === 'BR' ? 'Battle Royale' : 'Clash Squad'
  }

  const getTotalStats = () => {
    const totalRegistrations = filteredRegistrations.length
    const totalRevenue = filteredRegistrations
      .filter(reg => reg.paymentStatus === 'completed')
      .reduce((sum, reg) => sum + reg.registrationFee, 0)
    const paidRegistrations = filteredRegistrations.filter(reg => reg.paymentStatus === 'completed').length
    
    return { totalRegistrations, totalRevenue, paidRegistrations }
  }

  const stats = getTotalStats()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Nav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="space-y-8">
            <Skeleton className="h-12 w-96" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Nav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Organizer Dashboard
          </h1>
          <p className="text-purple-200">Manage your tournament registrations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRegistrations}</div>
              <p className="text-xs text-blue-200">
                {stats.paidRegistrations} paid, {stats.totalRegistrations - stats.paidRegistrations} pending
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-green-700 border-green-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-200">
                From {stats.paidRegistrations} paid registrations
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-purple-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
              <CheckCircle className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalRegistrations > 0 ? Math.round((stats.paidRegistrations / stats.totalRegistrations) * 100) : 0}%
              </div>
              <p className="text-xs text-purple-200">
                Successful payment completion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-black/20 border-purple-600 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-purple-200 mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <Input
                    placeholder="Team name, IGL name, ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-black/30 border-purple-600 text-white placeholder:text-purple-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-purple-200 mb-2 block">Payment Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-black/30 border-purple-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-purple-600">
                    <SelectItem value="all" className="text-white">All Status</SelectItem>
                    <SelectItem value="completed" className="text-white">Paid</SelectItem>
                    <SelectItem value="pending" className="text-white">Pending</SelectItem>
                    <SelectItem value="failed" className="text-white">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-purple-200 mb-2 block">Game Mode</label>
                <Select value={gameFilter} onValueChange={setGameFilter}>
                  <SelectTrigger className="bg-black/30 border-purple-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-purple-600">
                    <SelectItem value="all" className="text-white">All Games</SelectItem>
                    <SelectItem value="BR" className="text-white">Battle Royale</SelectItem>
                    <SelectItem value="CS" className="text-white">Clash Squad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" className="w-full border-purple-600 text-purple-200 hover:bg-purple-800">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registrations Table */}
        <Card className="bg-black/20 border-purple-600 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Tournament Registrations ({filteredRegistrations.length})
            </CardTitle>
            <CardDescription className="text-purple-200">
              All registrations across your tournaments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredRegistrations.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto text-purple-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No registrations found</h3>
                <p className="text-purple-300">
                  {registrations?.length === 0 ? "No one has registered for your tournaments yet." : "No registrations match your current filters."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-purple-600">
                      <TableHead className="text-purple-200">Team Info</TableHead>
                      <TableHead className="text-purple-200">IGL Details</TableHead>
                      <TableHead className="text-purple-200">Tournament</TableHead>
                      <TableHead className="text-purple-200">Fee</TableHead>
                      <TableHead className="text-purple-200">Payment Status</TableHead>
                      <TableHead className="text-purple-200">Registered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegistrations.map((registration) => (
                      <TableRow key={registration.id} className="border-purple-600 hover:bg-purple-800/20">
                        <TableCell>
                          <div>
                            <div className="font-medium text-white">{registration.teamName}</div>
                            <div className="text-sm text-purple-300">ID: {registration.id.slice(0, 8)}...</div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-white">
                              <User className="w-3 h-3" />
                              {registration.iglRealName}
                            </div>
                            <div className="flex items-center gap-2 text-purple-300 text-sm">
                              <Shield className="w-3 h-3" />
                              {registration.iglIngameId}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div>
                            <div className="font-medium text-white">{registration.tournament.name}</div>
                            <div className="text-sm text-purple-300">
                              {getGameModeDisplay(registration.tournament.gameMode)} {registration.tournament.type}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="font-medium text-green-400">
                            ₹{registration.registrationFee}
                          </div>
                          {registration.paymentMethod && (
                            <div className="text-xs text-purple-300 capitalize">
                              {registration.paymentMethod}
                            </div>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {getPaymentStatusBadge(registration.paymentStatus)}
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2 text-purple-300 text-sm">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(registration.registeredAt), "MMM dd, HH:mm")}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useLocation } from "wouter"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Trophy, Users, Calendar, Target } from "lucide-react"
import { apiRequest } from "@/lib/queryClient"

// Enhanced schema for Free Fire tournaments
const createTournamentSchema = z.object({
  name: z.string().min(3, "Tournament name must be at least 3 characters"),
  gameMode: z.enum(["BR", "CS"]),
  type: z.enum(["solo", "duo", "squad"]),
  slots: z.number().min(4, "Minimum 4 slots required").max(200, "Maximum 200 slots allowed"),
  slotPrice: z.number().min(0, "Slot price cannot be negative"),
  prizePool: z.number().min(0, "Prize pool cannot be negative"),
  matchCount: z.number().min(1, "At least 1 match required").max(10, "Maximum 10 matches allowed"),
  killPoints: z.number().min(1, "Kill points must be at least 1").max(10, "Maximum 10 points per kill"),
  positionPoints: z.string().min(1, "Position points are required"),
  startTime: z.string().min(1, "Start date and time are required"),
  rules: z.string().min(10, "Rules must be at least 10 characters"),
})

type CreateTournamentData = z.infer<typeof createTournamentSchema>

export default function CreateTournament() {
  const { toast } = useToast()
  const [, navigate] = useLocation()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [selectedGameMode, setSelectedGameMode] = useState<"BR" | "CS">("BR")

  const form = useForm<CreateTournamentData>({
    resolver: zodResolver(createTournamentSchema),
    defaultValues: {
      name: "",
      gameMode: "BR",
      type: "squad",
      slots: 100,
      slotPrice: 50,
      prizePool: 5000,
      matchCount: 4,
      killPoints: 1,
      positionPoints: "10,6,5,4,3,2,1",
      startTime: "",
      rules: "",
    },
  })

  const createTournamentMutation = useMutation({
    mutationFn: async (data: CreateTournamentData) => {
      if (!user?.id) throw new Error("User not authenticated")
      
      const tournamentData = {
        ...data,
        format: `${data.gameMode} ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}`,
        description: `${data.gameMode === 'BR' ? 'Battle Royale' : 'Clash Squad'} ${data.type} tournament`,
        startTime: new Date(data.startTime),
        registrationDeadline: new Date(new Date(data.startTime).getTime() - 30 * 60 * 1000), // 30 min before start
        organizerId: user.id,
        status: "open",
      }

      const response = await apiRequest("POST", "/api/tournaments", tournamentData)
      return response.json()
    },
    onSuccess: (tournament) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] })
      toast({
        title: "Tournament Created!",
        description: `${tournament.name} has been successfully created.`,
      })
      navigate("/dashboard")
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create tournament. Please try again.",
        variant: "destructive",
      })
    },
  })

  const onSubmit = (data: CreateTournamentData) => {
    createTournamentMutation.mutate(data)
  }

  const gameMode = form.watch("gameMode")

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="outline" className="mb-4" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Tournament</h1>
            <p className="text-gray-600">Set up your Free Fire tournament with custom rules and settings</p>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary-orange to-secondary-orange text-white">
            <CardTitle className="text-2xl flex items-center">
              <Trophy className="w-6 h-6 mr-2" />
              Tournament Configuration
            </CardTitle>
            <CardDescription className="text-orange-100">
              Configure your Free Fire tournament settings and rules
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Game Mode Selection */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-primary-orange" />
                    Game Mode
                  </h3>
                  <FormField
                    control={form.control}
                    name="gameMode"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-4">
                            <Button
                              type="button"
                              variant={field.value === "BR" ? "default" : "outline"}
                              className={`h-20 flex flex-col ${
                                field.value === "BR" 
                                  ? "bg-primary-orange text-white hover:bg-secondary-orange" 
                                  : "border-2 hover:border-primary-orange"
                              }`}
                              onClick={() => {
                                field.onChange("BR")
                                setSelectedGameMode("BR")
                              }}
                              data-testid="button-br-mode"
                            >
                              <Target className="w-6 h-6 mb-1" />
                              <span className="font-semibold">BR / FULLMAP</span>
                              <span className="text-xs opacity-75">Battle Royale</span>
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === "CS" ? "default" : "outline"}
                              className={`h-20 flex flex-col ${
                                field.value === "CS" 
                                  ? "bg-primary-orange text-white hover:bg-secondary-orange" 
                                  : "border-2 hover:border-primary-orange"
                              }`}
                              onClick={() => {
                                field.onChange("CS")
                                setSelectedGameMode("CS")
                              }}
                              data-testid="button-cs-mode"
                            >
                              <Users className="w-6 h-6 mb-1" />
                              <span className="font-semibold">CS / CLASH SQUAD</span>
                              <span className="text-xs opacity-75">Team Deathmatch</span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* BR/FULLMAP Configuration */}
                {gameMode === "BR" && (
                  <>
                    {/* Basic Information */}
                    <div className="bg-blue-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Trophy className="w-5 h-5 mr-2 text-blue-600" />
                        Tournament Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Tournament Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., Free Fire Pro Championship" 
                                  {...field}
                                  data-testid="input-tournament-name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Team Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-team-type">
                                    <SelectValue placeholder="Select team type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="solo">Solo</SelectItem>
                                  <SelectItem value="duo">Duo</SelectItem>
                                  <SelectItem value="squad">Squad</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="slots"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Slots</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="100" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  data-testid="input-slots"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-green-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Trophy className="w-5 h-5 mr-2 text-green-600" />
                        Pricing & Rewards
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="slotPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Slot Price (₹)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="50" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  data-testid="input-slot-price"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="prizePool"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prize Pool (₹)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="5000" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  data-testid="input-prize-pool"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="bg-purple-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                        Schedule & Matches
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date & Time</FormLabel>
                              <FormControl>
                                <Input 
                                  type="datetime-local" 
                                  {...field}
                                  data-testid="input-start-time"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="matchCount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Matches</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="4" 
                                  min="1"
                                  max="10"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                  data-testid="input-match-count"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Scoring System */}
                    <div className="bg-orange-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-orange-600" />
                        Scoring System
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="killPoints"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Points per Kill</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="1" 
                                  min="1"
                                  max="10"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                  data-testid="input-kill-points"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="positionPoints"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Position Points (1st,2nd,3rd,4th,5th,6th,7th+)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="10,6,5,4,3,2,1" 
                                  {...field}
                                  data-testid="input-position-points"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Rules */}
                    <div className="bg-red-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-red-600" />
                        Tournament Rules
                      </h3>
                      <FormField
                        control={form.control}
                        name="rules"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rules & Guidelines</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter tournament rules, guidelines, and important information for participants..."
                                className="min-h-[120px]"
                                {...field}
                                data-testid="textarea-rules"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                {/* CS/CLASH SQUAD Configuration - Placeholder */}
                {gameMode === "CS" && (
                  <div className="bg-gray-100 p-8 rounded-xl text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Clash Squad Configuration</h3>
                    <p className="text-gray-600">
                      Clash Squad tournament configuration will be available after implementing BR mode.
                    </p>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6">
                  <Link href="/dashboard" className="flex-1">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    className="flex-1 gradient-primary text-white"
                    disabled={createTournamentMutation.isPending || gameMode === "CS"}
                    data-testid="button-create-tournament"
                  >
                    {createTournamentMutation.isPending ? (
                      "Creating..."
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Tournament
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
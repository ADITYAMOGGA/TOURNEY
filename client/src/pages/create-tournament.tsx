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
import { ArrowLeft, Plus, Trophy, Users, Calendar, Target, Star, CreditCard } from "lucide-react"
import { apiRequest } from "@/lib/queryClient"

// Enhanced schema for gaming tournaments
const createTournamentSchema = z.object({
  name: z.string().min(3, "Tournament name must be at least 3 characters"),
  gameMode: z.enum(["BR", "CS"]),
  type: z.string().min(1, "Type is required"), // Dynamic based on game mode
  slots: z.number().min(4, "Minimum 4 slots required").max(200, "Maximum 200 slots allowed"),
  slotPrice: z.number().min(0, "Slot price cannot be negative"),
  prizePool: z.number().min(0, "Prize pool cannot be negative"),
  // BR-specific fields
  matchCount: z.number().min(1, "At least 1 match required").max(10, "Maximum 10 matches allowed").optional(),
  killPoints: z.number().min(1, "Kill points must be at least 1").max(10, "Maximum 10 points per kill").optional(),
  positionPoints: z.string().optional(),
  // CS-specific fields
  csGameVariant: z.enum(["Limited", "Unlimited", "Contra", "StateWar"]).optional(),
  device: z.enum(["PC", "Mobile", "Both"]).optional(),
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
  const [promotePayment, setPromotePayment] = useState(false)

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
      csGameVariant: "Limited",
      device: "Both",
      startTime: "",
      rules: "",
    },
  })

  const createTournamentMutation = useMutation({
    mutationFn: async (data: CreateTournamentData) => {
      if (!user?.id) throw new Error("User not authenticated")
      
      const tournamentData = {
        ...data,
        format: `${data.gameMode} ${data.type.toUpperCase()}`,
        description: `${data.gameMode === 'BR' ? 'Battle Royale' : 'Clash Squad'} ${data.type} tournament`,
        startTime: new Date(data.startTime),
        registrationDeadline: new Date(new Date(data.startTime).getTime() - 30 * 60 * 1000), // 30 min before start
        organizerId: user.id,
        status: "open",
        // Set defaults for missing fields based on game mode
        matchCount: data.gameMode === 'BR' ? data.matchCount : 1,
        killPoints: data.gameMode === 'BR' ? data.killPoints : 0,
        positionPoints: data.gameMode === 'BR' ? data.positionPoints : "",
        csGameVariant: data.gameMode === 'CS' ? data.csGameVariant : undefined,
        device: data.gameMode === 'CS' ? data.device : undefined,
        // Promotion fields
        isPromoted: promotePayment,
        promotionPaid: promotePayment, // For now, directly mark as paid when checked
        promotionAmount: promotePayment ? 100 : 0,
      }

      const response = await apiRequest("POST", "/api/tournaments", tournamentData)
      return response.json()
    },
    onSuccess: (tournament) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] })
      toast({
        title: "Tournament Created!",
        description: `${tournament.name} has been successfully created.${promotePayment ? ' Your tournament is now promoted!' : ''}`,
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
            <p className="text-gray-600">Set up your gaming tournament with custom rules and settings</p>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary-orange to-secondary-orange text-white">
            <CardTitle className="text-2xl flex items-center">
              <Trophy className="w-6 h-6 mr-2" />
              Tournament Configuration
            </CardTitle>
            <CardDescription className="text-orange-100">
              Configure your gaming tournament settings and rules
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
                                // Set defaults for BR mode
                                form.setValue("type", "squad")
                                form.setValue("slots", 100)
                                form.setValue("slotPrice", 50)
                                form.setValue("matchCount", 4)
                                form.setValue("killPoints", 1)
                                form.setValue("positionPoints", "10,6,5,4,3,2,1")
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
                                // Set defaults for CS mode
                                form.setValue("type", "4v4")
                                form.setValue("slots", 32)
                                form.setValue("slotPrice", 100)
                                form.setValue("csGameVariant", "Limited")
                                form.setValue("device", "Both")
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
                                  placeholder="e.g., Gaming Pro Championship" 
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

                {/* CS/CLASH SQUAD Configuration */}
                {gameMode === "CS" && (
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
                                  placeholder="e.g., Clash Squad Pro Championship" 
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
                              <FormLabel>Team Mode</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-cs-team-mode">
                                    <SelectValue placeholder="Select team mode" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1v1">1v1</SelectItem>
                                  <SelectItem value="2v2">2v2</SelectItem>
                                  <SelectItem value="3v3">3v3</SelectItem>
                                  <SelectItem value="4v4">4v4</SelectItem>
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
                                  placeholder="32" 
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

                    {/* Game Configuration */}
                    <div className="bg-purple-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-purple-600" />
                        Game Configuration
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="csGameVariant"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Game Variant</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-cs-game-variant">
                                    <SelectValue placeholder="Select game variant" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Limited">Limited</SelectItem>
                                  <SelectItem value="Unlimited">Unlimited</SelectItem>
                                  <SelectItem value="Contra">Contra</SelectItem>
                                  <SelectItem value="StateWar">StateWar</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="device"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Device Platform</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-device">
                                    <SelectValue placeholder="Select device platform" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="PC">PC Only</SelectItem>
                                  <SelectItem value="Mobile">Mobile Only</SelectItem>
                                  <SelectItem value="Both">Both PC & Mobile</SelectItem>
                                </SelectContent>
                              </Select>
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
                              <FormLabel>Entry Fee (₹)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="100" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  data-testid="input-entry-fee"
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
                                  placeholder="10000" 
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
                    <div className="bg-orange-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                        Schedule
                      </h3>
                      <div className="grid grid-cols-1 gap-6">
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

                {/* Promotion Section */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-200">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-600" />
                    Tournament Promotion
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">Promote Your Tournament</h4>
                        <p className="text-gray-600 text-sm mb-4">
                          Feature your tournament in our main banner carousel for maximum visibility. 
                          Your tournament will be displayed prominently on the homepage and dashboard.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CreditCard className="w-4 h-4" />
                          <span className="font-medium">Promotion Fee: ₹100</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="promote-tournament"
                          checked={promotePayment}
                          onChange={(e) => setPromotePayment(e.target.checked)}
                          className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                        />
                        <label htmlFor="promote-tournament" className="text-sm font-medium text-gray-700">
                          Promote Tournament
                        </label>
                      </div>
                    </div>
                    
                    {promotePayment && (
                      <div className="bg-white p-4 rounded-lg border border-yellow-300">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Promotion Fee</span>
                          <span className="text-lg font-bold text-orange-600">₹100</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Payment will be processed when you create the tournament
                        </p>
                      </div>
                    )}
                  </div>
                </div>

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
                    disabled={createTournamentMutation.isPending}
                    data-testid="button-create-tournament"
                  >
                    {createTournamentMutation.isPending ? (
                      "Creating..."
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        {promotePayment ? 'Create & Promote (₹100)' : 'Create Tournament'}
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
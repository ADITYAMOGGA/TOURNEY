import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  CreditCard, 
  DollarSign, 
  User, 
  Users, 
  Trophy, 
  Shield, 
  CheckCircle, 
  XCircle,
  Loader2
} from "lucide-react"
import { Tournament } from "@shared/schema"
import { apiRequest } from "@/lib/queryClient"

const registrationSchema = z.object({
  teamName: z.string().min(3, "Team name must be at least 3 characters").max(50, "Team name too long"),
  iglRealName: z.string().min(2, "IGL real name must be at least 2 characters").max(50, "Name too long"),
  iglIngameId: z.string().min(3, "IGL in-game ID must be at least 3 characters").max(30, "ID too long"),
  paymentMethod: z.enum(["upi", "card", "wallet"])
})

type RegistrationData = z.infer<typeof registrationSchema>

interface TournamentRegistrationFormProps {
  tournament: Tournament
  onSuccess: () => void
}

export default function TournamentRegistrationForm({ tournament, onSuccess }: TournamentRegistrationFormProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paymentResult, setPaymentResult] = useState<any>(null)
  
  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      teamName: "",
      iglRealName: "",
      iglIngameId: "",
      paymentMethod: "upi"
    }
  })

  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationData) => {
      const response = await apiRequest("POST", `/api/tournaments/${tournament.id}/register`, {
        userId: "mock-user-1", // Mock user ID for demo
        teamName: data.teamName,
        iglRealName: data.iglRealName,
        iglIngameId: data.iglIngameId,
        paymentMethod: data.paymentMethod
      });
      return response.json();
    },
    onSuccess: (registrationData) => {
      setCurrentStep(2)
      // Start fake payment processing
      processFakePayment(registrationData.id, form.getValues().paymentMethod)
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register for tournament.",
        variant: "destructive",
      })
    }
  })

  const processFakePayment = async (registrationId: string, paymentMethod: string) => {
    setPaymentProcessing(true)
    
    try {
      // Call fake payment API
      const response = await apiRequest("POST", `/api/registrations/${registrationId}/payment`, {
        paymentMethod
      })
      const result = await response.json()
      
      setPaymentResult(result)
      setPaymentProcessing(false)
      
      if (result.success) {
        toast({
          title: "Registration Successful!",
          description: "Payment completed! You're now registered for the tournament.",
        })
        setTimeout(() => {
          onSuccess()
        }, 3000)
      } else {
        toast({
          title: "Payment Failed",
          description: result.message || "Payment failed. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setPaymentProcessing(false)
      toast({
        title: "Payment Error",
        description: "Something went wrong with payment processing.",
        variant: "destructive",
      })
    }
  }

  const onSubmit = (data: RegistrationData) => {
    registerMutation.mutate(data)
  }

  const getGameModeDisplay = () => {
    return tournament.gameMode === 'BR' ? 'Battle Royale' : 'Clash Squad'
  }

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'upi':
        return <Shield className="w-5 h-5" />
      case 'card':
        return <CreditCard className="w-5 h-5" />
      case 'wallet':
        return <DollarSign className="w-5 h-5" />
      default:
        return <CreditCard className="w-5 h-5" />
    }
  }

  if (currentStep === 2) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-900 to-gray-800 text-white border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {paymentProcessing ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : paymentResult?.success ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
            {paymentProcessing ? "Processing Payment..." : 
             paymentResult?.success ? "Registration Complete!" : "Payment Failed"}
          </CardTitle>
          <CardDescription className="text-gray-300">
            {paymentProcessing ? "Please wait while we process your payment" :
             paymentResult?.success ? "Welcome to the tournament!" : "Please try again"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentProcessing && (
            <div className="space-y-3">
              <Progress value={65} className="h-2" />
              <div className="text-center text-sm text-gray-400">
                Securing your spot in the tournament...
              </div>
            </div>
          )}
          
          {paymentResult && (
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Transaction ID</span>
                  <span className="text-sm font-mono">{paymentResult.transactionId}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Amount</span>
                  <span className="text-sm font-semibold">₹{tournament.slotPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Status</span>
                  <Badge variant={paymentResult.success ? "default" : "destructive"} 
                         className={paymentResult.success ? "bg-green-600" : "bg-red-600"}>
                    {paymentResult.status}
                  </Badge>
                </div>
              </div>
              
              {paymentResult.success && (
                <div className="text-center text-sm text-gray-400">
                  You will be redirected automatically...
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white border-purple-700">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Join Tournament
        </CardTitle>
        <CardDescription className="text-purple-200">
          {tournament.name} • {getGameModeDisplay()} {tournament.type}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6 p-4 bg-black/20 rounded-lg border border-purple-600">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-purple-200">Registration Fee</span>
            <span className="text-xl font-bold text-yellow-400">₹{tournament.slotPrice}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-purple-200">Prize Pool</span>
            <span className="text-lg font-semibold text-green-400">₹{tournament.prizePool}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-purple-200">Spots Left</span>
            <span className="text-sm font-medium">{tournament.slots - tournament.registeredPlayers}</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-purple-200">
                    <Users className="w-4 h-4" />
                    Team Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your team name" 
                      {...field} 
                      className="bg-black/30 border-purple-600 text-white placeholder:text-purple-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="iglRealName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-purple-200">
                    <User className="w-4 h-4" />
                    IGL Real Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="In-Game Leader's real name" 
                      {...field} 
                      className="bg-black/30 border-purple-600 text-white placeholder:text-purple-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="iglIngameId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-purple-200">
                    <Shield className="w-4 h-4" />
                    IGL In-Game ID
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="IGL's Free Fire ID" 
                      {...field} 
                      className="bg-black/30 border-purple-600 text-white placeholder:text-purple-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="bg-purple-600" />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-purple-200">
                    <CreditCard className="w-4 h-4" />
                    Payment Method
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-black/30 border-purple-600 text-white">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-900 border-purple-600">
                      <SelectItem value="upi" className="text-white hover:bg-purple-800">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          UPI / GPay / PhonePe
                        </div>
                      </SelectItem>
                      <SelectItem value="card" className="text-white hover:bg-purple-800">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Credit / Debit Card
                        </div>
                      </SelectItem>
                      <SelectItem value="wallet" className="text-white hover:bg-purple-800">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Paytm / Wallet
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-3 transition-all duration-200 transform hover:scale-105"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  {getPaymentIcon(form.watch("paymentMethod"))}
                  <span className="ml-2">Pay ₹{tournament.slotPrice} & Register</span>
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-xs text-purple-300 text-center">
          <p>🔒 Secure payment • 100% safe & encrypted</p>
          <p className="mt-1">Demo payment system - No real money charged</p>
        </div>
      </CardContent>
    </Card>
  )
}
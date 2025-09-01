"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Calendar, Clock, Scissors, ArrowLeft, CreditCard, User } from "lucide-react"
import { useState } from "react"
import type { BookingData } from "@/app/page"

interface BookingConfirmationProps {
  bookingData: BookingData
  onBack: () => void
  onNewBooking: () => void
}

export function BookingConfirmation({ bookingData, onBack, onNewBooking }: BookingConfirmationProps) {
  const { services, date, time, totalPrice } = bookingData
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "completed">("pending")
  const [customerName, setCustomerName] = useState("")
  const depositAmount = 4000

  const handlePayment = async () => {
    if (!customerName.trim()) {
      alert("Por favor ingresá tu nombre para continuar")
      return
    }

    window.open("https://mpago.la/1NXhJWs", "_blank")

    setPaymentStatus("processing")

    setTimeout(() => {
      setPaymentStatus("completed")

      const booking = {
        id: Date.now().toString(),
        customerName: customerName.trim(),
        date: date?.toISOString().split("T")[0] || "",
        time: time || "",
        services: services.map((s) => s.name),
        totalPrice,
        depositPaid: true,
        remainingAmount: totalPrice - depositAmount,
        createdAt: new Date().toISOString(),
      }

      const existingBookings = JSON.parse(localStorage.getItem("barbershop-bookings") || "[]")

      existingBookings.push(booking)

      localStorage.setItem("barbershop-bookings", JSON.stringify(existingBookings))
    }, 2000)
  }

  if (paymentStatus === "completed") {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">¡Reserva confirmada!</h2>
          <p className="text-muted-foreground">Tu turno ha sido reservado exitosamente</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Detalles de tu reserva
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Cliente</p>
                <p className="text-muted-foreground">{customerName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Fecha</p>
                <p className="text-muted-foreground">
                  {date?.toLocaleDateString("es-AR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Hora</p>
                <p className="text-muted-foreground">{time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Scissors className="h-5 w-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <p className="font-medium mb-2">Servicios</p>
                <div className="space-y-1">
                  {services.map((service, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{service.name}</span>
                      <span className="text-muted-foreground">${service.price.toLocaleString("es-AR")}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border mt-2 pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">${totalPrice.toLocaleString("es-AR")}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-green-600">Seña pagada</span>
                    <span className="text-green-600">${depositAmount.toLocaleString("es-AR")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Restante (pagar en el local)</span>
                    <span className="text-muted-foreground">
                      ${(totalPrice - depositAmount).toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Información importante:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Llegá 10 minutos antes de tu cita</li>
              <li>• Si necesitás cancelar o reprogramar, contactanos con 24hs de anticipación</li>
              <li>• Ya pagaste la seña de ${depositAmount.toLocaleString("es-AR")} - restante se paga en el local</li>
              <li>• Todos los servicios incluyen café o una medida de whisky</li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <Button onClick={onNewBooking} className="flex-1">
            Nueva reserva
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Confirmar reserva</h2>
        <p className="text-muted-foreground">Revisá los detalles y realizá el pago de la seña</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Datos del cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="customerName">Nombre completo</Label>
            <Input
              id="customerName"
              type="text"
              placeholder="Ingresá tu nombre completo"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Detalles de tu reserva
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Fecha</p>
              <p className="text-muted-foreground">
                {date?.toLocaleDateString("es-AR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Hora</p>
              <p className="text-muted-foreground">{time}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Scissors className="h-5 w-5 text-muted-foreground mt-1" />
            <div className="flex-1">
              <p className="font-medium mb-2">Servicios</p>
              <div className="space-y-1">
                {services.map((service, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{service.name}</span>
                    <span className="text-muted-foreground">${service.price.toLocaleString("es-AR")}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border mt-2 pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice.toLocaleString("es-AR")}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Pago de seña
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-primary/5 p-4 rounded-lg mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              Para confirmar tu reserva, necesitás pagar una seña de:
            </p>
            <p className="text-2xl font-bold text-primary">${depositAmount.toLocaleString("es-AR")}</p>
            <p className="text-sm text-muted-foreground mt-1">
              El resto (${(totalPrice - depositAmount).toLocaleString("es-AR")}) se paga en el local
            </p>
          </div>

          <Button
            onClick={handlePayment}
            disabled={paymentStatus === "processing" || !customerName.trim()}
            className="w-full"
            size="lg"
          >
            {paymentStatus === "processing" ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Procesando pago...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Pagar seña con MercadoPago
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>
    </div>
  )
}

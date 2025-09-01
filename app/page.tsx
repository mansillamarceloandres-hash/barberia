"use client"

import { useState } from "react"
import { ServiceSelection } from "@/components/service-selection"
import { AppointmentCalendar } from "@/components/appointment-calendar"
import { BookingConfirmation } from "@/components/booking-confirmation"
import { AdminPanel } from "@/components/admin-panel"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

export type Service = {
  id: string
  name: string
  price: number
  duration: string
  icon: string
  description?: string
}

export type BookingData = {
  services: Service[]
  date: Date | null
  time: string | null
  totalPrice: number
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<"services" | "calendar" | "confirmation" | "admin">("services")
  const [selectedServices, setSelectedServices] = useState<Service[]>([])
  const [bookingData, setBookingData] = useState<BookingData>({
    services: [],
    date: null,
    time: null,
    totalPrice: 0,
  })

  const handleServicesSelected = (services: Service[]) => {
    setSelectedServices(services)
    setCurrentStep("calendar")
  }

  const handleAppointmentBooked = (date: Date, time: string) => {
    const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0)
    setBookingData({
      services: selectedServices,
      date,
      time,
      totalPrice,
    })
    setCurrentStep("confirmation")
  }

  const handleBackToServices = () => {
    setCurrentStep("services")
  }

  const handleBackToCalendar = () => {
    setCurrentStep("calendar")
  }

  const handleNewBooking = () => {
    setCurrentStep("services")
    setSelectedServices([])
    setBookingData({
      services: [],
      date: null,
      time: null,
      totalPrice: 0,
    })
  }

  const handleShowAdmin = () => {
    setCurrentStep("admin")
  }

  const handleBackFromAdmin = () => {
    setCurrentStep("services")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            <div className="text-center">
              <h1 className="font-bold text-yellow-600 font-serif text-5xl">Barber420</h1>
              <p className="text-muted-foreground mt-2">Reservá tu turno online</p>
            </div>
            <div className="flex-1 flex justify-end">
              {currentStep !== "admin" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShowAdmin}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentStep === "services" && <ServiceSelection onServicesSelected={handleServicesSelected} />}

        {currentStep === "calendar" && (
          <AppointmentCalendar
            selectedServices={selectedServices}
            onAppointmentBooked={handleAppointmentBooked}
            onBack={handleBackToServices}
          />
        )}

        {currentStep === "confirmation" && (
          <BookingConfirmation
            bookingData={bookingData}
            onBack={handleBackToCalendar}
            onNewBooking={handleNewBooking}
          />
        )}

        {currentStep === "admin" && <AdminPanel onBack={handleBackFromAdmin} />}
      </main>
    </div>
  )
}

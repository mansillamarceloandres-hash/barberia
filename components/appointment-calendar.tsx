"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import type { Service } from "@/app/page"

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
]

interface AppointmentCalendarProps {
  selectedServices: Service[]
  onAppointmentBooked: (date: Date, time: string) => void
  onBack: () => void
}

export function AppointmentCalendar({ selectedServices, onAppointmentBooked, onBack }: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [existingBookings, setExistingBookings] = useState<any[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const bookings = JSON.parse(localStorage.getItem("barbershop-bookings") || "[]")
    console.log("[v0] Loaded bookings:", bookings) // Debug log
    setExistingBookings(bookings)
  }, [refreshTrigger]) // Added refreshTrigger as dependency

  const refreshBookings = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  useEffect(() => {
    const handleStorageChange = () => {
      refreshBookings()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("bookingMade", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("bookingMade", handleStorageChange)
    }
  }, [])

  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0)
  const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0)

  const getDurationInSlots = (duration: number) => {
    return Math.ceil(duration / 30)
  }

  const getTimeSlotIndex = (time: string) => {
    return timeSlots.indexOf(time)
  }

  const isTimeSlotAvailable = (time: string, date: Date) => {
    if (!date) return false

    const dateString = date.toISOString().split("T")[0]
    const timeIndex = getTimeSlotIndex(time)
    const slotsNeeded = getDurationInSlots(totalDuration)

    console.log("[v0] Checking availability for:", { time, dateString, slotsNeeded, existingBookings }) // Debug log

    if (timeIndex + slotsNeeded > timeSlots.length) {
      console.log("[v0] Not enough slots remaining") // Debug log
      return false
    }

    for (let i = 0; i < slotsNeeded; i++) {
      const slotTime = timeSlots[timeIndex + i]
      const currentSlotIndex = timeIndex + i

      const hasConflict = existingBookings.some((booking) => {
        if (booking.date !== dateString) return false

        const bookingTimeIndex = getTimeSlotIndex(booking.time)
        const bookingDuration = booking.services.reduce((sum: number, service: any) => sum + service.duration, 0)
        const bookingSlotsNeeded = getDurationInSlots(bookingDuration)

        const isOverlapping =
          currentSlotIndex >= bookingTimeIndex && currentSlotIndex < bookingTimeIndex + bookingSlotsNeeded

        if (isOverlapping) {
          console.log("[v0] Conflict found:", {
            currentSlot: slotTime,
            existingBooking: booking.time,
            existingDuration: bookingDuration,
          }) // Debug log
        }

        return isOverlapping
      })

      if (hasConflict) return false
    }

    return true
  }

  const getAvailableTimeSlots = () => {
    if (!selectedDate) return []

    return timeSlots.filter((time) => isTimeSlotAvailable(time, selectedDate))
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const isDateAvailable = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today && date.getDay() !== 0
  }

  const handleDateSelect = (date: Date | null) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date)
      setSelectedTime(null)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleConfirmBooking = () => {
    if (selectedDate && selectedTime) {
      console.log("[v0] Confirming booking:", { selectedDate, selectedTime, selectedServices }) // Debug log
      onAppointmentBooked(selectedDate, selectedTime)
      setTimeout(() => {
        refreshBookings()
      }, 100)
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          Volver a servicios
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Seleccioná fecha y hora</h2>
          <p className="text-muted-foreground">
            Total: ${totalPrice.toLocaleString("es-AR")} • Duración: {totalDuration} min
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentDate).map((date, index) => (
                <button
                  key={index}
                  onClick={() => handleDateSelect(date)}
                  disabled={!isDateAvailable(date)}
                  className={`
                    p-2 text-sm rounded-md transition-colors
                    ${!date ? "invisible" : ""}
                    ${!isDateAvailable(date) ? "text-muted-foreground cursor-not-allowed" : "hover:bg-accent"}
                    ${
                      selectedDate && date && selectedDate.toDateString() === date.toDateString()
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }
                  `}
                >
                  {date?.getDate()}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardHeader>
            <CardTitle>Horarios disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <p className="text-muted-foreground text-center py-8">
                Seleccioná una fecha para ver los horarios disponibles
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {getAvailableTimeSlots().map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTimeSelect(time)}
                    className="text-sm"
                  >
                    {time}
                  </Button>
                ))}
                {getAvailableTimeSlots().length === 0 && (
                  <div className="col-span-3 text-center py-4 text-muted-foreground">
                    No hay horarios disponibles para esta fecha con la duración seleccionada
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedDate && selectedTime && (
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Confirmá tu reserva</h3>
              <div className="space-y-2 text-sm mb-6">
                <p>
                  <strong>Fecha:</strong> {selectedDate.toLocaleDateString("es-AR")}
                </p>
                <p>
                  <strong>Hora:</strong> {selectedTime}
                </p>
                <p>
                  <strong>Servicios:</strong> {selectedServices.map((s) => s.name).join(", ")}
                </p>
                <p className="text-lg font-bold text-primary">
                  <strong>Total: ${totalPrice.toLocaleString("es-AR")}</strong>
                </p>
              </div>
              <Button onClick={handleConfirmBooking} size="lg" className="w-full">
                Confirmar reserva
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

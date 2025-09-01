"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Calendar, Clock, DollarSign, ChevronLeft, ChevronRight, User } from "lucide-react"

interface Booking {
  id: string
  date: string
  time: string
  services: string[]
  totalPrice: number
  depositPaid: boolean
  remainingAmount: number
  customerName?: string
  customerPhone?: string
}

interface AdminPanelProps {
  onBack: () => void
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")

  const handleLogin = () => {
    if (password === "admin123") {
      setIsAuthenticated(true)
    } else {
      alert("Contraseña incorrecta")
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      const savedBookings = localStorage.getItem("barbershop-bookings")
      if (savedBookings) {
        setBookings(JSON.parse(savedBookings))
      }
    }
  }, [isAuthenticated])

  const filteredBookings = bookings.filter((booking) => booking.date === selectedDate)

  const totalDayRevenue = filteredBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)
  const totalDeposits = filteredBookings.reduce((sum, booking) => sum + (booking.depositPaid ? 4000 : 0), 0)

  const getBookingsForDate = (date: string) => {
    return bookings.filter((booking) => booking.date === date).length
  }

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const currentDate = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      const dateStr = currentDate.toISOString().split("T")[0]
      const bookingCount = getBookingsForDate(dateStr)
      const isCurrentMonth = currentDate.getMonth() === month
      const isToday = dateStr === new Date().toISOString().split("T")[0]
      const isSelected = dateStr === selectedDate

      days.push({
        date: new Date(currentDate),
        dateStr,
        bookingCount,
        isCurrentMonth,
        isToday,
        isSelected,
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1))
      return newDate
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Panel de Administración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Ingresar
            </Button>
            <Button variant="outline" onClick={onBack} className="w-full bg-transparent">
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const calendarDays = generateCalendarDays()
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
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground">Panel de Administración</h2>
          <p className="text-muted-foreground">Gestión de reservas</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            onClick={() => setViewMode("calendar")}
            size="sm"
          >
            Calendario
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} onClick={() => setViewMode("list")} size="sm">
            Lista
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Reservas del día</p>
                <p className="text-2xl font-bold">{filteredBookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Ingresos del día</p>
                <p className="text-2xl font-bold">${totalDayRevenue.toLocaleString("es-AR")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Señas cobradas</p>
                <p className="text-2xl font-bold">${totalDeposits.toLocaleString("es-AR")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <label className="text-sm text-muted-foreground">Fecha</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {viewMode === "calendar" && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day.dateStr)}
                  className={`
                    relative p-3 text-sm rounded-lg transition-colors hover:bg-muted
                    ${!day.isCurrentMonth ? "text-muted-foreground opacity-50" : ""}
                    ${day.isToday ? "bg-primary text-primary-foreground" : ""}
                    ${day.isSelected ? "ring-2 ring-primary" : ""}
                  `}
                >
                  <span>{day.date.getDate()}</span>
                  {day.bookingCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {day.bookingCount}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>Reservas para {new Date(selectedDate).toLocaleDateString("es-AR")}</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No hay reservas para esta fecha</p>
            ) : (
              <div className="space-y-4">
                {filteredBookings
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((booking) => (
                    <Card key={booking.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{booking.time}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Cliente</p>
                              <p className="font-medium">{booking.customerName || "Sin nombre"}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground">Servicios</p>
                            <p className="font-medium">{booking.services.join(", ")}</p>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="font-bold text-primary">${booking.totalPrice.toLocaleString("es-AR")}</p>
                            {booking.depositPaid && <p className="text-xs text-green-600">Seña pagada: $4.000</p>}
                            <p className="text-xs text-muted-foreground">
                              Restante: ${booking.remainingAmount.toLocaleString("es-AR")}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${booking.depositPaid ? "bg-green-500" : "bg-yellow-500"}`}
                            />
                            <span className="text-sm">{booking.depositPaid ? "Confirmada" : "Pendiente"}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {viewMode === "calendar" && (
        <Card>
          <CardHeader>
            <CardTitle>Reservas para {new Date(selectedDate).toLocaleDateString("es-AR")}</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No hay reservas para esta fecha</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBookings
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((booking) => (
                    <Card key={booking.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{booking.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{booking.customerName || "Sin nombre"}</span>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Servicios</p>
                            <p className="font-medium text-sm">{booking.services.join(", ")}</p>
                          </div>
                          <div>
                            <p className="font-bold text-primary">${booking.totalPrice.toLocaleString("es-AR")}</p>
                            {booking.depositPaid && <p className="text-xs text-green-600">Seña pagada</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${booking.depositPaid ? "bg-green-500" : "bg-yellow-500"}`}
                            />
                            <span className="text-xs">{booking.depositPaid ? "Confirmada" : "Pendiente"}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

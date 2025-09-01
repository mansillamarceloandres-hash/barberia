"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Scissors, Zap, Crown, Eye, Sparkles, Star } from "lucide-react"
import type { Service } from "@/app/page"

const services: Service[] = [
  {
    id: "haircut",
    name: "Corte",
    price: 14000,
    duration: "40 min",
    icon: "scissors",
  },
  {
    id: "beard",
    name: "Barba",
    price: 8000,
    duration: "20 min",
    icon: "zap",
  },
  {
    id: "combo",
    name: "Corte + barba",
    price: 18000,
    duration: "1 hr",
    icon: "crown",
  },
  {
    id: "eyebrows",
    name: "Perfilado de cejas",
    price: 5000,
    duration: "10 min",
    icon: "eye",
  },
  {
    id: "complete",
    name: "Corte completo",
    price: 20000,
    duration: "1 hr 10 min",
    icon: "sparkles",
    description: "Pelo + barba + perfilado de cejas",
  },
  {
    id: "premium",
    name: "Corte premium",
    price: 30000,
    duration: "2 hrs",
    icon: "star",
    description: "Pelo + barba + perfilado de cejas + limpieza facial + masaje facial",
  },
]

const getIcon = (iconName: string) => {
  const iconProps = { className: "h-8 w-8 text-primary" }
  switch (iconName) {
    case "scissors":
      return <Scissors {...iconProps} />
    case "zap":
      return <Zap {...iconProps} />
    case "crown":
      return <Crown {...iconProps} />
    case "eye":
      return <Eye {...iconProps} />
    case "sparkles":
      return <Sparkles {...iconProps} />
    case "star":
      return <Star {...iconProps} />
    default:
      return <Scissors {...iconProps} />
  }
}

interface ServiceSelectionProps {
  onServicesSelected: (services: Service[]) => void
}

export function ServiceSelection({ onServicesSelected }: ServiceSelectionProps) {
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([])

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const handleContinue = () => {
    const selectedServices = services.filter((service) => selectedServiceIds.includes(service.id))
    onServicesSelected(selectedServices)
  }

  const totalPrice = services
    .filter((service) => selectedServiceIds.includes(service.id))
    .reduce((sum, service) => sum + service.price, 0)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Seleccioná tus servicios</h2>
        <p className="text-muted-foreground">Elegí uno o más servicios para tu cita</p>
        <div className="mt-4 p-4 bg-accent/20 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground">
            ☕ <strong>Todos los servicios incluyen:</strong> Café o una medida de whisky
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {services.map((service) => (
          <div
            key={service.id}
            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedServiceIds.includes(service.id)
                ? "ring-2 ring-primary bg-accent/10 border-primary"
                : "border-border"
            }`}
            onClick={() => handleServiceToggle(service.id)}
          >
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={selectedServiceIds.includes(service.id)}
                onChange={() => handleServiceToggle(service.id)}
                className="pointer-events-none"
              />
              <div className="flex items-center space-x-3">
                {getIcon(service.icon)}
                <div>
                  <h3 className="font-semibold text-foreground">{service.name}</h3>
                  {service.description && <p className="text-sm text-muted-foreground">{service.description}</p>}
                  <p className="text-sm text-muted-foreground font-medium">{service.duration}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-primary">${service.price.toLocaleString("es-AR")}</div>
            </div>
          </div>
        ))}
      </div>

      {selectedServiceIds.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Servicios seleccionados:</h3>
            <div className="text-2xl font-bold text-primary">Total: ${totalPrice.toLocaleString("es-AR")}</div>
          </div>

          <div className="space-y-2 mb-6">
            {services
              .filter((service) => selectedServiceIds.includes(service.id))
              .map((service) => (
                <div key={service.id} className="flex justify-between text-sm">
                  <span>{service.name}</span>
                  <span>${service.price.toLocaleString("es-AR")}</span>
                </div>
              ))}
          </div>

          <Button onClick={handleContinue} className="w-full" size="lg">
            Continuar con la reserva
          </Button>
        </div>
      )}
    </div>
  )
}

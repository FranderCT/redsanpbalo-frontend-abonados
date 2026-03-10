import { useState } from "react";
import type { LegalSupplier } from "../../Models/LegalSupplier";
import EditLegalSupplierModal from "../Modals/EditLegalSupplierModal";
import GetInfoLegalSupplierModal from "../Modals/GetInfoLegalSupplier";
import AgentSupplierModal from "../../../Supplier_agent/Components/AgentSupplierModal";
import DeleteLegalSupplierModal from "../Modals/DeleteLegalSupplierModal";
import { DataPagination } from "@/Components/ui/data-pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Mail, Phone, Building2, Globe, MoreVertical } from "lucide-react";

type Props = {
  data: LegalSupplier[];
  total?: number;
  page: number;
  pageCount: number;
  onPageChange: (p: number) => void;
};

export default function LegalSupplierCards({
  data,
  total,
  page,
  pageCount,
  onPageChange,
}: Props) {
  const [editingSupplier, setEditingSupplier] = useState<LegalSupplier | null>(null);
  const [getInfoSupplier, setGetInfoSupplier] = useState<LegalSupplier | null>(null);
  const [agentsSupplierId, setAgentsSupplierId] = useState<number | null>(null);
  const [disableSupplier, setDisableSupplier] = useState<LegalSupplier | null>(null);

  return (
    <div className="w-full space-y-4">
      {editingSupplier && (
        <EditLegalSupplierModal
          supplier={editingSupplier}
          open={true}
          onClose={() => setEditingSupplier(null)}
          onSuccess={() => setEditingSupplier(null)}
        />
      )}

      {getInfoSupplier && (
        <GetInfoLegalSupplierModal
          supplier={getInfoSupplier}
          open={true}
          onClose={() => setGetInfoSupplier(null)}
          onSuccess={() => setGetInfoSupplier(null)}
        />
      )}

      {agentsSupplierId !== null && (
        <AgentSupplierModal
          legalSupplierId={agentsSupplierId}
          open={true}
          onClose={() => setAgentsSupplierId(null)}
        />
      )}

      {data.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">
            No hay proveedores jurídicos para mostrar
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => {
            const supplier = item.Supplier;
            const companyName = supplier?.Name ?? "—";
            const isActive = supplier?.IsActive ?? true;

            return (
              <Card
                key={item.Id}
                className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md"
              >
                <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ring-2 ring-border">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate text-base font-semibold text-foreground">
                      {companyName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <span className="truncate">Cédula jurídica: {supplier?.IDcard ?? "—"}</span>
                    </CardDescription>
                  </div>
                  <Badge
                    variant={isActive ? "default" : "destructive"}
                    className="shrink-0 text-xs"
                  >
                    {isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-3 pt-0">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{supplier?.Email || "Sin correo"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{supplier?.PhoneNumber || "Sin teléfono"}</span>
                  </div>
                  {item.WebSite ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <a
                        href={item.WebSite.startsWith("http") ? item.WebSite : `https://${item.WebSite}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                      >
                        {item.WebSite}
                      </a>
                    </div>
                  ) : null}
                </CardContent>

                <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                  <div className="w-full flex items-center ">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setGetInfoSupplier(item)}
                    >
                      Ver detalles
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          aria-label="Más acciones sobre el proveedor"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-[180px]">
                        <DropdownMenuItem onClick={() => setGetInfoSupplier(item)}>
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingSupplier(item)}>
                          Editar proveedor
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setAgentsSupplierId(item.Id)}>
                          Gestión agentes
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                          onClick={() => setDisableSupplier(item)}
                        >
                          Inhabilitar proveedor
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <div className="border-t border-border pt-4">
        <DataPagination
          page={page}
          pageCount={pageCount}
          total={total ?? data.length}
          onPageChange={onPageChange}
          labels={{ totalItems: "proveedores" }}
          compact
        />
      </div>

      <DeleteLegalSupplierModal
        legalsupplier={disableSupplier}
        open={!!disableSupplier}
        onClose={() => setDisableSupplier(null)}
        onSuccess={() => setDisableSupplier(null)}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/Components/ui/card";
import { MapPin, MoreVertical } from "lucide-react";
import type { ReportLocation } from "../Models/ReportLocation";
import EditReportLocationModal from "./Modals/EditReportLocationModal";
import DeleteReportLocationModal from "./Modals/DeleteReportLocationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";

type Props = {
  reportLocation: ReportLocation;
  onDeleteSuccess?: () => void;
};

export default function ReportLocationCard({
  reportLocation,
  onDeleteSuccess,
}: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Card className="w-full sm:w-72 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center gap-3">
          <MapPin className="h-5 w-5 text-[#091540]" />
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <CardTitle className="text-base font-medium truncate">
              {reportLocation.Neighborhood}
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              ID: {reportLocation.Id}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-auto">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setDeleteOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
      </Card>

      <EditReportLocationModal
        reportLocation={reportLocation}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />

      <DeleteReportLocationModal
        reportLocation={reportLocation}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSuccess={onDeleteSuccess}
      />
    </>
  );
}

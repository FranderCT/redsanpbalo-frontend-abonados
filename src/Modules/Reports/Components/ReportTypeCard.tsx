"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/Components/ui/card";
import { MoreVertical, Tags } from "lucide-react";
import type { ReportType } from "../Models/ReportType";
import EditReportTypeModal from "./Modals/EditReportTypeModal";
import DeleteReportTypeModal from "./Modals/DeleteReportTypeModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";

type Props = {
  reportType: ReportType;
  onDeleteSuccess?: () => void;
};

export default function ReportTypeCard({ reportType, onDeleteSuccess }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Card className="w-full sm:w-72 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center gap-3">
          <Tags className="h-5 w-5 text-[#091540]" />
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <CardTitle className="text-base font-medium truncate">
              {reportType.Name}
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              ID: {reportType.Id}
              {reportType.IsActive === false && (
                <span className="ml-1.5 text-destructive/80">· Inactivo</span>
              )}
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

      <EditReportTypeModal
        reportType={reportType}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />

      <DeleteReportTypeModal
        reportType={reportType}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSuccess={onDeleteSuccess}
      />
    </>
  );
}

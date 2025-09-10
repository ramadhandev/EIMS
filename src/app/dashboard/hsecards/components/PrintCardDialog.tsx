"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import { HSECard } from "@/types/hsecards";

interface PrintCardDialogProps {
  card: HSECard;
}

export default function PrintCardDialog({ card }: PrintCardDialogProps) {
  const printRef = useRef<HTMLDivElement>(null);

  // Mapping warna berdasarkan jenis kartu
const cardColors: Record<string, { from: string; to: string }> = {
  Safety: { from: "from-green-600", to: "to-green-400" },
  Visitor: { from: "from-blue-600", to: "to-blue-400" },
  Contractor: { from: "from-red-600", to: "to-red-400" },
  Default: { from: "from-gray-600", to: "to-gray-400" },
};

const colors = cardColors[card.cardTypeName] || cardColors["Default"];


 const handlePrint = useReactToPrint({
  contentRef: printRef,
  documentTitle: `Kartu-${card.cardNumber}`,
});


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="no-print">
          <Printer className="h-4 w-4 mr-1" /> Cetak
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Preview ID Card</DialogTitle>
        </DialogHeader>

        {/* Card Container */}
        <div ref={printRef} className="flex gap-6 print:gap-0">
          {/* --- FRONT SIDE --- */}
         <div
  className="border rounded-xl shadow-md overflow-hidden bg-white flex flex-col relative print:break-inside-avoid"
  style={{ width: "60mm", height: "95mm" }}
>
            <div className={`h-28 bg-gradient-to-r ${colors.from} ${colors.to} rounded-b-[80%] flex flex-col justify-center items-center text-white`}>
              <h1 className="font-bold text-sm">COMPANY NAME</h1>
              <p className="text-[10px]">SLOGAN HERE</p>
            </div>

            {/* photo bulat */}
            <div className="flex justify-center -mt-9">
               <div className={`w-20 h-20 rounded-full border-2 ${colors.from} overflow-hidden bg-gray-200`}>
                <img
                  src="/avatar.png"
                  alt="Foto"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* info utama */}
            <div className="text-center mt-1">
              <h2 className="font-bold text-base">{card.userName}</h2>
              <p className={`${colors.from.replace("from-", "text-")} text-xs`}>{card.cardTypeName}</p>
            </div>

            {/* detail data */}
            <div className="px-4 mt-2 text-[10px] space-y-0.5">
              <p><span className="font-semibold">ID No:</span> {card.cardNumber}</p>
              <p><span className="font-semibold">DOB:</span> 00-00-0000</p>
              <p><span className="font-semibold">Phone:</span> 000-123-4567890</p>
              <p><span className="font-semibold">Email:</span> example@mail.com</p>
              <p><span className="font-semibold">Join:</span> {new Date(card.issuedDate).toLocaleDateString("id-ID")}</p>
              <p><span className="font-semibold">Expire:</span> {new Date(card.expiredDate).toLocaleDateString("id-ID")}</p>
            </div>

            {/* footer wave */}
            <div className={`mt-auto h-12 bg-gradient-to-r ${colors.from} ${colors.to} rounded-t-[80%]`}></div>
          </div>

          {/* --- BACK SIDE --- */}
          <div
  className="border rounded-xl shadow-md overflow-hidden bg-white flex flex-col print:break-inside-avoid"
  style={{ width: "60mm", height: "95mm" }}
>

            {/* header merah wave */}
           <div className={`h-16 bg-gradient-to-r ${colors.from} ${colors.to} rounded-b-[80%] flex items-center justify-center text-white`}>
              <h2 className="font-bold text-sm">TERMS AND CONDITIONS</h2>
            </div>

            <div className="flex-1 px-4 mt-2 text-[10px]">
              <p className="text-center text-[9px] text-gray-600 mb-2">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </p>

              <div className="space-y-0.5">
                <p><span className="font-semibold">Joined:</span> {new Date(card.issuedDate).toLocaleDateString("id-ID")}</p>
                <p><span className="font-semibold">Expire:</span> {new Date(card.expiredDate).toLocaleDateString("id-ID")}</p>
                <p><span className="font-semibold">Phone:</span> 000-123-4567890</p>
                <p><span className="font-semibold">Mail:</span> example@mail.com</p>
              </div>

              {/* tanda tangan */}
              <div className="mt-4 text-center">
                <p className="italic">John Smeeth</p>
                <p className="text-[9px]">Designation Here</p>
              </div>

              {/* Barcode */}
              <div className="flex justify-center mt-4">
                <Barcode value={card.cardNumber} height={30} displayValue={false} />
              </div>
            </div>

            {/* footer */}
            <div className={`mt-auto h-12 bg-gradient-to-r ${colors.from} ${colors.to} rounded-t-[80%] flex flex-col justify-center items-center text-white`}>
              <p className="font-bold text-xs">COMPANY NAME</p>
              <p className="text-[8px]">SLOGAN HERE</p>
            </div>
          </div>
        </div>

        {/* tombol print */}
        <div className="flex justify-end pt-4 no-print">
         <Button onClick={handlePrint} className="bg-green-600 hover:bg-green-700 no-print">
        <Printer className="h-4 w-4 mr-2" /> Cetak
        </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}

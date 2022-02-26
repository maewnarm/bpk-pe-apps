import React from "react";
import jsPDF from "jspdf";
import { font_denso_normal } from "@/public/fonts/Denso-normal";
import { font_angsana_new_normal } from "@/public/fonts/angsana new-normal";
import { font_angsana_new_bold } from "@/public/fonts/angsana new-bold";
import { font_angsana_new_italic } from "@/public/fonts/angsana new-italic";
import { font_angsana_new_bolditalic } from "@/public/fonts/angsana new-bolditalic";
import { font_angsana_upc_normal } from "@/public/fonts/angsana upc-normal";
import { font_angsana_upc_bold } from "@/public/fonts/angsana upc-bold";
import { font_angsana_upc_italic } from "@/public/fonts/angsana upc-italic";
import { font_angsana_upc_bolditalic } from "@/public/fonts/angsana upc-bolditalic";

export function addFontStyle(doc: jsPDF) {
  doc
    .addFileToVFS("/Denso-normal.ttf", font_denso_normal)
    .addFont("/Denso-normal.ttf", "Denso", "normal");
  doc
    .addFileToVFS("/Angsana-new.ttf", font_angsana_new_normal)
    .addFont("/Angsana-new.ttf", "Angsana new", "normal");
  doc
    .addFileToVFS("/Angsana-new.ttf", font_angsana_new_bold)
    .addFont("/Angsana-new.ttf", "Angsana new", "bold");
  doc
    .addFileToVFS("/Angsana-new.ttf", font_angsana_new_italic)
    .addFont("/Angsana-new.ttf", "Angsana new", "italic");
  doc
    .addFileToVFS("/Angsana-new.ttf", font_angsana_new_bolditalic)
    .addFont("/Angsana-new.ttf", "Angsana new", "bolditalic");
  doc
    .addFileToVFS("/Angsana-new.ttf", font_angsana_upc_normal)
    .addFont("/Angsana-new.ttf", "Angsana upc", "normal");
  doc
    .addFileToVFS("/Angsana-new.ttf", font_angsana_upc_bold)
    .addFont("/Angsana-new.ttf", "Angsana upc", "bold");
  doc
    .addFileToVFS("/Angsana-new.ttf", font_angsana_upc_italic)
    .addFont("/Angsana-new.ttf", "Angsana upc", "italic");
  doc
    .addFileToVFS("/Angsana-new.ttf", font_angsana_upc_bolditalic)
    .addFont("/Angsana-new.ttf", "Angsana upc", "bolditalic");
}

export function drawRecordForm(doc: jsPDF) {
  // add text
  doc.setFont("Angsana upc", "italic");
  doc.text("Base salary", 20, 20);
  doc.text("Position salary", 20, 40);
  doc.text("20,000", 150, 20);
  doc.text("40,000", 150, 40);

  doc.setFont("Denso", "normal");
  doc.setTextColor(220, 0, 50);
  doc.text("DENSO", 20, 80);
}
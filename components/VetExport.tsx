'use client';

import React, { useState } from 'react';
import { FileText, Download, Check } from 'lucide-react';
import { DogData, BreedData, CalculationResults } from '@/lib/types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface VetExportProps {
  dogData: DogData;
  breedData: BreedData;
  metrics: CalculationResults;
}

export default function VetExport({ dogData, breedData, metrics }: VetExportProps) {
  const [exported, setExported] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generatePDFReport = async () => {
    setGenerating(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Header with Logo
      pdf.setFillColor(20, 184, 166); // Teal
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('FurVitals Health Report', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Comprehensive Health Summary for Veterinary Consultation', pageWidth / 2, 30, { align: 'center' });
      
      yPosition = 50;

      // Patient Information
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Patient Information', 15, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      const reportDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      pdf.text(`Generated: ${reportDate}`, 15, yPosition);
      yPosition += 6;
      pdf.text(`Name: ${dogData.name}`, 15, yPosition);
      yPosition += 6;
      pdf.text(`Breed: ${breedData.breed}`, 15, yPosition);
      yPosition += 6;
      pdf.text(`Age: ${dogData.chronological_age.toFixed(1)} yrs Dog / ${metrics.chronologicalHumanAge} yrs Human (Bio: ${metrics.biologicalAge.toFixed(1)} yrs Dog / ${metrics.biologicalHumanAge} yrs Human)`, 15, yPosition);
      yPosition += 6;
      pdf.text(`Weight: ${dogData.weight_lbs} lbs`, 15, yPosition);
      
      yPosition += 15;

      // Current Vitals
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Current Vitals', 15, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      pdf.text(`Heart Rate: ${dogData.current_vitals.heart_rate_bpm} bpm (Baseline: ${breedData.vitals_baseline?.min_rhr}-${breedData.vitals_baseline?.max_rhr} bpm)`, 15, yPosition);
      yPosition += 6;
      pdf.text(`Respiratory Rate: ${dogData.current_vitals.respiratory_rate_srr} breaths/min (Baseline: ~${breedData.vitals_baseline?.avg_srr} breaths/min)`, 15, yPosition);
      yPosition += 6;
      pdf.text(`Heart Rate Variability: ${dogData.current_vitals.hrv_ms} ms`, 15, yPosition);
      yPosition += 6;
      pdf.text(`Body Temperature: ${dogData.current_vitals.body_temp_f}°F`, 15, yPosition);
      
      yPosition += 15;

      // Vaccination History
      if (dogData.medical_records?.vaccines && dogData.medical_records.vaccines.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Vaccination History', 15, yPosition);
        
        yPosition += 10;
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        
        dogData.medical_records.vaccines.forEach((vaccine: any) => {
          pdf.text(`${vaccine.name}: ${new Date(vaccine.date).toLocaleDateString()} (${vaccine.status})`, 15, yPosition);
          yPosition += 6;
        });
        
        yPosition += 10;
      }

      // Health Metrics
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Health Metrics', 15, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      pdf.text(`Readiness Score: ${metrics.readinessScore}/100`, 15, yPosition);
      yPosition += 6;
      pdf.text(`  - Sleep Quality: ${metrics.sleepScore}/100`, 20, yPosition);
      yPosition += 6;
      pdf.text(`  - HRV Recovery: ${metrics.hrvRecovery}/100`, 20, yPosition);
      yPosition += 6;
      pdf.text(`  - Activity Balance: ${metrics.activityBalance}/100`, 20, yPosition);
      
      yPosition += 15;

      // 7-Day Summary
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('7-Day Activity Summary', 15, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      dogData.historical_data_7d.forEach((day) => {
        pdf.text(`${day.date}: RHR ${day.avg_rhr} bpm, SRR ${day.avg_srr}, Sleep ${day.sleep_hours}h, Steps ${day.steps}, HRV ${day.hrv}ms`, 15, yPosition);
        yPosition += 5;
      });
      
      yPosition += 10;

      // Health Alerts
      if (metrics.alerts.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(220, 38, 38); // Red
        pdf.text('Health Alerts', 15, yPosition);
        pdf.setTextColor(0, 0, 0);
        
        yPosition += 10;
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        
        metrics.alerts.forEach((alert) => {
          pdf.text(`[${alert.severity.toUpperCase()}] ${alert.title}`, 15, yPosition);
          yPosition += 6;
          pdf.text(`${alert.description}`, 20, yPosition);
          yPosition += 6;
          pdf.text(`Condition: ${alert.condition}`, 20, yPosition);
          yPosition += 10;
        });
      }

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Generated by FurVitals Health Monitoring System', pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text('For veterinary consultation only. Not a substitute for professional diagnosis.', pageWidth / 2, pageHeight - 5, { align: 'center' });

      // Save PDF
      pdf.save(`${dogData.name}_Health_Report.pdf`);
      
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch (error) {
      console.error('PDF generation error:', error);
    } finally {
      setGenerating(false);
    }
  };

  const generateReport_OLD_TXT = () => {
    // Keep old text version as backup
    const reportDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const report = `
═══════════════════════════════════════════════════════════
                    PAWSPULSE HEALTH REPORT
═══════════════════════════════════════════════════════════

Generated: ${reportDate}

Patient Information:
--------------------
Name: ${dogData.name}
Breed: ${breedData.breed}
Size Category: ${breedData.size_category}
Chronological Age: ${dogData.chronological_age.toFixed(1)} yrs (Dog) / ${metrics.chronologicalHumanAge} yrs (Human)
Biological Age: ${metrics.biologicalAge.toFixed(1)} yrs (Dog) / ${metrics.biologicalHumanAge} yrs (Human)
Weight: ${dogData.weight_lbs} lbs

Current Vitals (Last Updated: ${new Date(dogData.current_vitals.last_updated).toLocaleString()}):
--------------------
• Heart Rate (RHR): ${dogData.current_vitals.heart_rate_bpm} bpm
  (Breed baseline: ${breedData.vitals_baseline?.min_rhr}-${breedData.vitals_baseline?.max_rhr} bpm)
  
• Respiratory Rate (SRR): ${dogData.current_vitals.respiratory_rate_srr} breaths/min
  (Breed baseline: ~${breedData.vitals_baseline?.avg_srr} breaths/min)
  
• Heart Rate Variability (HRV): ${dogData.current_vitals.hrv_ms} ms
  
• Body Temperature: ${dogData.current_vitals.body_temp_f}°F

Health Metrics:
--------------------
• Readiness Score: ${metrics.readinessScore}/100
  - Sleep Quality: ${metrics.sleepScore}/100
  - HRV Recovery: ${metrics.hrvRecovery}/100
  - Activity Balance: ${metrics.activityBalance}/100

7-Day Vitals Trend:
--------------------
${dogData.historical_data_7d.map(day => 
  `${day.date}: RHR ${day.avg_rhr} bpm, SRR ${day.avg_srr}, Sleep ${day.sleep_hours}h, Steps ${day.steps}, HRV ${day.hrv}ms`
).join('\n')}

Sleep Analysis (Last Night):
--------------------
• Total Sleep: ${(dogData.sleep_analysis_last_night.total_sleep_minutes / 60).toFixed(1)} hours
• Deep Sleep: ${(dogData.sleep_analysis_last_night.deep_sleep_minutes / 60).toFixed(1)} hours
• REM Sleep: ${(dogData.sleep_analysis_last_night.rem_sleep_minutes / 60).toFixed(1)} hours
• Wake-ups: ${dogData.sleep_analysis_last_night.wake_ups}
• Fragmentation Index: ${dogData.sleep_analysis_last_night.fragmentation_index}

Behavioral Data (Today):
--------------------
• Steps: ${dogData.behavioral_stats_today.steps.toLocaleString()}
• Active Minutes: ${dogData.behavioral_stats_today.active_minutes}
• Nighttime Pacing: ${dogData.behavioral_stats_today.pacing_minutes_night} minutes
• Vigilance Score: ${dogData.behavioral_stats_today.vigilance_score}
• High-Impact Jumps: ${dogData.behavioral_stats_today.high_impact_jumps}
• Barking Events: ${dogData.behavioral_stats_today.barking_count}

Health Alerts:
--------------------
${metrics.alerts.length > 0 
  ? metrics.alerts.map(alert => 
      `[${alert.severity.toUpperCase()}] ${alert.title}\n${alert.description}\nCondition: ${alert.condition}\n`
    ).join('\n')
  : 'No active health alerts ✓'}

Breed-Specific Information:
--------------------
• Common Risks: ${breedData.common_risks?.join(', ') || 'N/A'}
• Activity Budget: ${breedData.activity_budget_mins} minutes/day
• Energy Level: ${breedData.energy_level}/5
• Lifespan Range: ${breedData.lifespan_range[0]}-${breedData.lifespan_range[1]} years
• Veterinary Notes: ${breedData.vitals_logic}

═══════════════════════════════════════════════════════════
This report was generated by PawsPulse Health Monitoring System.
For veterinary consultation only. Not a substitute for professional diagnosis.
═══════════════════════════════════════════════════════════
`;

    // Create downloadable file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PawsPulse_${dogData.name}_HealthReport_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-pink-50 to-rose-50 p-6 shadow-lg border-2 border-white/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-pink-200 rounded-2xl animate-float">
          <FileText className="w-6 h-6 text-pink-700" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Veterinarian Report</h3>
          <p className="text-sm text-gray-600">Export 7-day health summary</p>
        </div>
      </div>

      <div className="bg-white/80 rounded-2xl p-6 border-2 border-white">
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Report Includes:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-teal-500 font-bold mt-0.5">✓</span>
              <span>Complete vitals history (7 days)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-500 font-bold mt-0.5">✓</span>
              <span>Sleep analysis & behavior metrics</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-500 font-bold mt-0.5">✓</span>
              <span>Active health alerts & risk factors</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-500 font-bold mt-0.5">✓</span>
              <span>Breed-specific baseline comparisons</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-500 font-bold mt-0.5">✓</span>
              <span>Vaccination history & medical records</span>
            </li>
          </ul>
        </div>

        <button
          onClick={generatePDFReport}
          disabled={exported || generating}
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg
                     transition-all transform hover:scale-105 disabled:scale-100
                     ${exported 
                       ? 'bg-green-500 cursor-not-allowed' 
                       : generating
                       ? 'bg-gray-400 cursor-wait'
                       : 'bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500'
                     }`}
        >
          {exported ? (
            <span className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              PDF Downloaded!
            </span>
          ) : generating ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating PDF...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Share with Vet (PDF)
            </span>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-3 italic">
          Professional PDF report • Ready for vet consultation
        </p>
      </div>
    </div>
  );
}

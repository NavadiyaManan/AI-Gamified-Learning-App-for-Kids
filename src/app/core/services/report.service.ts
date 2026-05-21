import { Injectable } from '@angular/core';
import { Child, ParentAnalytics } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    generateChildProgressReport(child: Child, analytics: ParentAnalytics | null): string {
        const date = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        let report = `
╔════════════════════════════════════════════════════════╗
║          TINYGENIUS - CHILD PROGRESS REPORT            ║
╚════════════════════════════════════════════════════════╝

Generated: ${date}

┌─ CHILD PROFILE ─────────────────────────────────────────┐
│ Name:              ${child.name}
│ Age:               ${child.age} years old
│ Current Level:     ${child.level}
│ Total XP Earned:   ${child.totalXP}
│ Daily Streak:      ${child.streak} days 🔥
│ Member Since:      ${child.createdDate.toLocaleDateString()}
└─────────────────────────────────────────────────────────┘

┌─ LEARNING PROGRESS ─────────────────────────────────────┐
│
│ 🔤 ALPHABETS
│ Completed: ${child.learningProgress.alphabets.completed}/${child.learningProgress.alphabets.total}
│ Progress:  ${'█'.repeat(Math.floor(child.learningProgress.alphabets.completed / 2.6))}${'░'.repeat(10 - Math.floor(child.learningProgress.alphabets.completed / 2.6))} ${Math.floor((child.learningProgress.alphabets.completed / child.learningProgress.alphabets.total) * 100)}%
│
│ 🔢 NUMBERS
│ Completed: ${child.learningProgress.numbers.completed}/${child.learningProgress.numbers.total}
│ Progress:  ${'█'.repeat(Math.floor(child.learningProgress.numbers.completed / 1))}${'░'.repeat(10 - Math.floor(child.learningProgress.numbers.completed / 1))} ${Math.floor((child.learningProgress.numbers.completed / child.learningProgress.numbers.total) * 100)}%
│
│ 🦁 ANIMALS
│ Completed: ${child.learningProgress.animals.completed}/${child.learningProgress.animals.total}
│ Progress:  ${'█'.repeat(Math.floor(child.learningProgress.animals.completed / 2))}${'░'.repeat(10 - Math.floor(child.learningProgress.animals.completed / 2))} ${Math.floor((child.learningProgress.animals.completed / child.learningProgress.animals.total) * 100)}%
│
│ 🧩 PUZZLES
│ Completed: ${child.learningProgress.puzzles.completed}/${child.learningProgress.puzzles.total}
│ Progress:  ${'█'.repeat(Math.floor(child.learningProgress.puzzles.completed / 1.5))}${'░'.repeat(10 - Math.floor(child.learningProgress.puzzles.completed / 1.5))} ${Math.floor((child.learningProgress.puzzles.completed / child.learningProgress.puzzles.total) * 100)}%
│
│ 📖 STORIES
│ Completed: ${child.learningProgress.stories.completed}/${child.learningProgress.stories.total}
│ Progress:  ${'█'.repeat(Math.floor(child.learningProgress.stories.completed / 1))}${'░'.repeat(10 - Math.floor(child.learningProgress.stories.completed / 1))} ${Math.floor((child.learningProgress.stories.completed / child.learningProgress.stories.total) * 100)}%
│
└─────────────────────────────────────────────────────────┘

${analytics ? this.generateAnalyticsSection(analytics) : ''}

┌─ RECOMMENDATIONS ──────────────────────────────────────┐
│ ${this.getRecommendations(child).join('\n│ ')}
└─────────────────────────────────────────────────────────┘

┌─ NEXT GOALS ───────────────────────────────────────────┐
│ • Continue practicing alphabets
│ • Explore more puzzle games
│ • Read interactive stories
│ • Maintain daily learning streak
│ • Reach Level ${child.level + 1} (${100 - (child.totalXP % 100)} XP remaining)
└─────────────────────────────────────────────────────────┘

╔════════════════════════════════════════════════════════╗
║  Keep up the great work! Your child is learning well!  ║
║         TinyGenius Team - Making Learning Fun         ║
╚════════════════════════════════════════════════════════╝
`;
        return report;
    }

    private generateAnalyticsSection(analytics: ParentAnalytics): string {
        const totalTime = analytics.totalLearningTime;
        const avgDaily = Math.round(totalTime / analytics.weeklyActiveDay);

        return `
┌─ WEEKLY ANALYTICS ──────────────────────────────────────┐
│ Total Learning Time:    ${totalTime} minutes
│ Active Days:            ${analytics.weeklyActiveDay}/7 days
│ Average Per Day:        ${avgDaily} minutes
│ Average Session:        ${analytics.averageSessionDuration} minutes
│ Last Session:           ${new Date(analytics.lastSessionDate).toLocaleDateString()}
└─────────────────────────────────────────────────────────┘
`;
    }

    private getRecommendations(child: Child): string[] {
        const recommendations: string[] = [];

        if (child.learningProgress.alphabets.completed === child.learningProgress.alphabets.total) {
            recommendations.push('✓ Excellent! All alphabets learned!');
        }

        if (child.learningProgress.puzzles.completed < 5) {
            recommendations.push('→ Try more puzzle games for better problem-solving');
        }

        if (child.streak >= 7) {
            recommendations.push('🔥 Amazing streak! Keep the momentum going!');
        } else if (child.streak < 3) {
            recommendations.push('→ Aim for a 7-day learning streak');
        }

        if (child.totalXP < 500) {
            recommendations.push('→ Keep learning to reach higher levels and unlock rewards');
        }

        if (recommendations.length === 0) {
            recommendations.push('✓ Great progress! Keep exploring all learning areas');
        }

        return recommendations;
    }

    downloadReport(filename: string, content: string): void {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    printReport(content: string): void {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write('<pre style="font-family: monospace; padding: 20px; line-height: 1.5;">' + content.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>');
            printWindow.document.close();
            printWindow.print();
        }
    }
}

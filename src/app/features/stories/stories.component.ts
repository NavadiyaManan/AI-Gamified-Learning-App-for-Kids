import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '@core/services/data.service';
import { AudioService } from '@core/services/audio.service';
import { MascotService } from '@core/services/mascot.service';
import { SettingsService } from '@core/services/settings.service';

interface Story {
    id: number;
    title: string;
    emoji: string;
    description: string;
    content: string;
    moral: string;
    readingTime: number;
    characters: string[];
}

@Component({
    selector: 'app-stories',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-pastel-purple via-pastel-pink to-pastel-blue pb-32">
      <!-- Floating Header Card -->
      <header class="px-5 pt-8 md:px-10">
        <div class="mx-auto max-w-6xl">
          <div class="card-floating p-6 md:p-8 flex flex-col gap-4 relative">
            <button (click)="goBack()" 
              class="absolute right-6 top-6 btn-icon bg-slate-100 text-primary hover:bg-slate-200 w-10 h-10 flex items-center justify-center rounded-full text-base font-black">
              ✕
            </button>
            <div>
              <p class="text-xs uppercase tracking-widest font-black text-pink-500 mb-2">COZY QUEST</p>
              <h1 class="text-3xl md:text-4xl font-black text-pink-500">Story Time! 📖</h1>
            </div>
            <!-- Voice Selector -->
            <div class="flex flex-wrap items-center gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100 mt-2">
              <label class="text-slate-600 font-black text-xs uppercase tracking-wider">🔊 Choose Voice:</label>
              <select
                [(ngModel)]="selectedVoiceIndex"
                (change)="onVoiceChanged()"
                class="px-4 py-2 rounded-xl border-2 border-slate-200 bg-white text-secondary font-bold cursor-pointer focus:outline-none text-sm"
              >
                <option *ngFor="let voice of availableVoices; let i = index" [value]="i">
                  {{ getVoiceName(voice) }}
                </option>
              </select>
              <button
                (click)="playVoiceDemo()"
                class="btn-secondary px-4 py-2 text-xs rounded-xl"
              >
                🔊 Test Voice
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Progress Bar -->
      <div class="max-w-6xl mx-auto px-5 pt-8 md:px-10">
        <div class="mb-4">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs uppercase tracking-widest font-black text-pink-500">Stories Read: {{ completedCount }}/{{ stories.length }}</p>
            <p class="text-sm font-black text-cyan-500">{{ (completedCount / stories.length * 100).toFixed(0) }}%</p>
          </div>
          <div class="bg-slate-100 rounded-full h-5 overflow-hidden border-2 border-white shadow-inner relative">
            <div
              class="h-full rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-emerald-400 animated-xp transition-all duration-500"
              [style.width.%]="(completedCount / stories.length * 100)"
            ></div>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="max-w-6xl mx-auto px-5 py-8 md:px-10">
        <!-- Story cards grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            *ngFor="let story of stories; let i = index"
            (click)="selectStory(story, i)"
            class="card-floating p-6 cursor-pointer transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-soft-lg bg-gradient-to-br from-white to-gray-50 border-2 border-secondary border-opacity-20 flex flex-col justify-between min-h-[280px]"
          >
            <div>
              <!-- Story emoji -->
              <div class="text-5xl mb-3 text-center animate-float select-none">
                {{ story.emoji }}
              </div>

              <!-- Story title -->
              <h3 class="text-lg font-black text-center text-primary mb-2 font-fredoka">{{ story.title }}</h3>

              <!-- Reading time -->
              <p class="text-xs text-gray-600 text-center mb-3">⏱️ {{ story.readingTime }} min read</p>

              <!-- Description -->
              <p class="text-sm text-secondary text-center mb-4 line-clamp-2">{{ story.description }}</p>
            </div>

            <!-- Read button -->
            <button
              (click)="selectStory(story, i); $event.stopPropagation()"
              class="btn-secondary w-full"
            >
              📖 Read Story
            </button>

            <!-- Completed badge -->
            <div *ngIf="isCompleted(i)" class="mt-3 px-3 py-1 bg-gradient-to-r from-secondary to-blue-400 text-white rounded-full text-xs font-black text-center uppercase tracking-wider">
              ✓ Read
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-4 justify-center flex-wrap mt-12">
          <button
            (click)="goBack()"
            class="btn-secondary px-8 py-3.5 rounded-full font-black text-sm"
          >
            ← Back
          </button>
          <button
            *ngIf="completedCount === stories.length"
            (click)="completeLearning()"
            class="btn-primary px-8 py-3.5 text-sm"
          >
            ✨ All Done! Earn Reward
          </button>
        </div>
      </div>

      <!-- Story Reading Modal -->
      <div *ngIf="showStoryModal" class="fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[85vh] overflow-y-auto card-floating p-0 flex flex-col">
          <!-- Header -->
          <div class="bg-gradient-to-r from-secondary to-primary p-6 rounded-t-[2.5rem]">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="text-4xl select-none">{{ selectedStory?.emoji }}</div>
                <div>
                  <h2 class="text-2xl font-black text-white font-fredoka">{{ selectedStory?.title }}</h2>
                  <p class="text-white opacity-90 text-xs font-black uppercase tracking-wider">⏱️ {{ selectedStory?.readingTime }} min read</p>
                </div>
              </div>
              <button
                (click)="closeModal()"
                class="text-white text-3xl font-black hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Story Content -->
          <div class="p-8 overflow-y-auto">
            <!-- Story text -->
            <div class="mb-8">
              <p class="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap font-semibold mb-4">
                {{ selectedStory?.content }}
              </p>
            </div>

            <!-- Characters -->
            <div class="mb-8 bg-gradient-to-r from-pastel-yellow to-yellow-50 rounded-3xl p-6 border-2 border-warning">
              <p class="text-xs text-gray-600 font-black tracking-widest uppercase mb-3">Characters in this story:</p>
              <div class="flex flex-wrap gap-3">
                <div
                  *ngFor="let char of selectedStory?.characters"
                  class="px-4 py-2 bg-white rounded-full border-2 border-secondary text-primary font-black text-sm"
                >
                  {{ char }}
                </div>
              </div>
            </div>

            <!-- Moral/Lesson -->
            <div class="mb-8 bg-gradient-to-r from-pastel-green to-green-50 rounded-3xl p-6 border-2 border-accent-green">
              <p class="text-xs text-gray-600 font-black tracking-widest uppercase mb-2">Moral of the story:</p>
              <p class="text-base font-black text-primary">{{ selectedStory?.moral }}</p>
            </div>

            <!-- Voice controls -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <button
                (click)="speak(selectedStory?.content || '')"
                class="btn-primary py-3"
              >
                🔊 Read Aloud
              </button>
              <button
                (click)="stopSpeaking()"
                class="btn-secondary py-3"
              >
                ⏹️ Stop
              </button>
            </div>

            <!-- Action buttons -->
            <div class="grid grid-cols-2 gap-4 border-t pt-6 border-slate-100">
              <button
                (click)="closeModal()"
                class="btn-secondary"
              >
                Back
              </button>
              <button
                (click)="markAsCompleted()"
                class="btn-primary"
              >
                Finished! ✓
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Celebration popup -->
      <div
        *ngIf="showCelebration"
        class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      >
        <div class="text-6xl animate-bounce-slow">🎉</div>
        <div class="text-6xl animate-bounce-slow" style="animation-delay: 0.2s">⭐</div>
        <div class="text-6xl animate-bounce-slow" style="animation-delay: 0.4s">🎊</div>
      </div>
    </div>
  `,
    styles: []
})
export class StoriesComponent implements OnInit {
    stories: Story[] = [
        {
            id: 1,
            title: 'The Curious Rabbit',
            emoji: '🐰',
            description: 'A little rabbit discovers the world beyond the forest.',
            content: `Once upon a time, in a cozy burrow at the edge of a green forest, lived a small rabbit named Rosie. She had soft white fur and big curious eyes that sparkled with wonder.

One sunny morning, Rosie heard a sound beyond the forest. "What could that be?" she wondered. Despite her mother's warnings, she hopped towards the mysterious sound.

As she emerged from the trees, she saw a beautiful meadow filled with colorful flowers she had never seen before. Butterflies danced through the air, and a gentle stream sparkled in the sunshine.

Rosie spent the day exploring and making new friends with a wise old owl and a friendly squirrel. By evening, she realized her forest home was wonderful, but the world around it was even more amazing.

From that day on, Rosie became known as the bravest rabbit in the forest, and she often shared her adventures with her friends.`,
            moral: 'Curiosity and bravery help us discover new things and make wonderful discoveries.',
            readingTime: 3,
            characters: ['Rosie', 'Mother Rabbit', 'Wise Owl', 'Friendly Squirrel']
        },
        {
            id: 2,
            title: 'The Lion and the Mouse',
            emoji: '🦁',
            description: 'A mighty lion learns that even the smallest friend can help.',
            content: `In the African savanna, there lived a mighty lion named Leo who was the king of all animals. He was strong, brave, and very proud.

One day, while Leo was sleeping under a big tree, a tiny mouse accidentally ran across his paw. Leo woke up with a roar! "How dare you disturb my sleep!" he growled.

The frightened mouse squeaked, "Please, great king, forgive me! I meant no harm. Maybe one day I can help you!"

Leo laughed so hard that all the animals heard it. "You? Help me? That's the funniest thing I've ever heard!" he said, but he let the mouse go anyway.

Weeks later, hunters came and caught Leo in a net. The brave little mouse heard Leo's roars and ran to help. With her tiny teeth, she chewed through the rope until Leo was free!

Leo looked at the mouse with new respect and said, "You were right. Size doesn't matter when you have a big heart. Thank you, my small friend!"`,
            moral: 'True friendship and kindness matter more than size or strength.',
            readingTime: 4,
            characters: ['Leo the Lion', 'Tiny Mouse', 'Hunters', 'Animals']
        },
        {
            id: 3,
            title: 'The Magical Seed',
            emoji: '🌱',
            description: 'A girl plants a seed and learns patience and growth.',
            content: `A young girl named Emma received a special seed from her grandmother. "Plant this with love and patience," her grandmother said with a mysterious smile.

Emma planted the seed in a small pot and watered it every day. She waited and waited, but nothing happened for weeks. "Maybe I'm doing it wrong," she thought sadly.

But Emma didn't give up. She talked to the seed, sung to it, and gave it sunshine. One morning, a tiny green shoot appeared! Emma was so excited!

As days passed, the shoot grew taller and stronger. Beautiful flowers soon bloomed, filling the room with a sweet fragrance. Emma's friends came to admire her magical garden.

"Grandma, it finally grew! But it took so long," Emma said. Her grandmother smiled. "Good things take time, dear. The waiting and care you gave it is what made it truly magical."

Emma learned that with patience, love, and hard work, anything beautiful can grow.`,
            moral: 'Patience and consistent care lead to beautiful results.',
            readingTime: 3,
            characters: ['Emma', 'Grandmother', 'Seed', 'Friends']
        },
        {
            id: 4,
            title: 'The Busy Ant',
            emoji: '🐜',
            description: 'An ant learns the importance of hard work and preparation.',
            content: `In a busy anthill, there lived an ant named Andy who was always working. While other ants played, Andy collected food and built tunnels.

"Come play with us!" his friends called. "Why do you always work?"

Andy just smiled and continued his work. He gathered seeds, stored food, and strengthened the colony's walls.

When summer turned to autumn, everything changed. A cold wind began to blow, and food became scarce. The ants who had played all summer had nothing to eat.

But Andy's colony had plenty of food stored safely. While it was cold outside, the ants inside Andy's tunnels stayed warm and well-fed.

"Thank you, Andy!" his friends said. "We didn't understand before, but now we see that your hard work saved us all."

From that day on, all the ants learned the value of preparation and hard work.`,
            moral: 'Hard work and planning ahead help us face challenges successfully.',
            readingTime: 3,
            characters: ['Andy the Ant', 'Ant Friends', 'Ant Colony']
        },
        {
            id: 5,
            title: 'The Shy Butterfly',
            emoji: '🦋',
            description: 'A butterfly overcomes shyness and discovers inner beauty.',
            content: `In a garden full of bright flowers lived a butterfly named Bella. Unlike other butterflies with vibrant colors, Bella had soft, pale wings.

Because of her plain wings, Bella felt shy. She hid behind flowers and rarely flew with the other butterflies.

One day, a caterpillar got stuck on a web. While the other bright butterflies were too busy admiring their reflections, shy Bella helped. Using her small, delicate wings, she freed the caterpillar and guided it to a safe leaf.

"Thank you, kind butterfly," said the caterpillar. "Your wings may not be the brightest, but your heart is the most beautiful!"

The next morning, as the sun rose, something magical happened. In the golden light, Bella's pale wings began to shimmer with rainbow colors that only appeared in the morning sun.

All the other butterflies gathered around in wonder. "Bella, you're the most beautiful!" they said.

But Bella just smiled. She now understood that true beauty comes from kindness and helping others, not from how you look.`,
            moral: 'True beauty comes from kindness and a good heart, not appearance.',
            readingTime: 3,
            characters: ['Bella the Butterfly', 'Other Butterflies', 'Caterpillar']
        },
        {
            id: 6,
            title: 'The Wise Elephant',
            emoji: '🐘',
            description: 'An elephant uses wisdom to solve a water crisis.',
            content: `In the African grasslands, there lived an old elephant named Ela who was known for her wisdom. All the animals respected her advice.

One terrible day, the river dried up, and there was no water anywhere. All the animals gathered around Ela. "Please, wise Ela, where can we find water?" they begged.

Ela thought carefully and said, "Follow me to the mountain where I once lived."

The animals followed, but the journey was long and hot. Many wanted to give up. "How do we know there's water?" they complained.

"Trust me," said Ela kindly. When they reached the mountain, Ela showed them an ancient well hidden behind rocks. Cool, fresh water flowed from it!

All the animals drank their fill and were saved. They thanked Ela, who smiled and said, "I remembered the well from my younger days. This is why it's important to learn from experience and remember what we've seen."

The animals learned that wisdom comes from experience and listening to those who have lived longer.`,
            moral: 'Experience and wisdom help us solve difficult problems.',
            readingTime: 4,
            characters: ['Wise Elephant Ela', 'All the Animals', 'Mountain Creatures']
        },
        {
            id: 7,
            title: 'The Brave Little Penguin',
            emoji: '🐧',
            description: 'A young penguin finds courage in the face of fear.',
            content: `In Antarctica lived a young penguin named Pip who was afraid of deep water. All the other penguins could dive deep and swim fast, but Pip stayed in the shallow areas.

"Come swim with us!" called his friends. But Pip always shook his head in fear.

One day, Pip's friend got caught in a strong current far from shore. All the other penguins were too scared to help in such deep, dangerous water.

Pip looked at his friend struggling and forgot about his fear. He waddled as fast as he could to the water's edge and dove in. Deeper and deeper he went, pushing through his fear.

With all his strength, Pip reached his friend and helped guide him back to safety. When they reached the shore, all the penguins cheered.

"You were so brave, Pip!" they said. Pip's friend hugged him. "Thank you for saving me!"

From that day on, Pip realized that courage isn't about not being afraid—it's about doing what's right even when you're scared.`,
            moral: 'Courage is doing the right thing even when you\'re afraid.',
            readingTime: 3,
            characters: ['Pip the Penguin', 'Penguin Friends', 'Friend in Danger']
        },
        {
            id: 8,
            title: 'The Kind Giraffe',
            emoji: '🦒',
            description: 'A tall giraffe uses her height to help others.',
            content: `In the African savanna lived a giraffe named Grace who was taller than all the other animals. With her long neck, she could reach the highest leaves in the trees.

One day, a small bird got its nest stuck high in a tree during a storm. "Help! Help!" it chirped. The other animals tried to help, but the nest was too high.

"Don't worry," said Grace. She stretched her long neck up, up, up and carefully brought the nest down to safety.

Later, a monkey lost his baby monkey in the tree canopy. Again, Grace helped. "Thank you, Grace!" the mother monkey cried with joy.

But not all animals were grateful. A proud zebra said, "You're too tall and different. You don't belong with us."

Grace felt sad, but she didn't stop being kind. The next day, the zebra got stuck in mud. Grace used her long neck to reach a branch and help pull the zebra out.

The zebra felt ashamed. "I'm sorry for what I said. You're the kindest animal in the savanna!"

Grace smiled. "Being different is not a problem—it's a gift that helps us help others."`,
            moral: 'Our differences make us special and help us contribute in unique ways.',
            readingTime: 4,
            characters: ['Grace the Giraffe', 'Small Bird', 'Mother Monkey', 'Proud Zebra']
        },
        {
            id: 9,
            title: 'The Helpful Hedgehog',
            emoji: '🦔',
            description: 'A hedgehog learns that helping others brings joy.',
            content: `In a cozy forest lived a little hedgehog named Henry with prickly spines covering his back. Many animals were scared of him because of his spines.

Feeling lonely, Henry wanted to make friends. One cold morning, he found a baby bird that had fallen from its nest, shivering and scared.

Without hesitation, Henry gently rolled his small body around the baby bird, and his spines formed a warm, protective shell. He stayed like that all night, keeping the baby bird warm.

When morning came, the mother bird returned. "Thank you, kind hedgehog!" she sang. "You saved my baby!"

Word spread through the forest. Soon, injured animals came to Henry for help. He would use his gentle paws to help them and his spines to protect them from danger.

Even though Henry's spines made other animals nervous at first, they soon learned that his true nature was kind and caring.

"Henry, you have the biggest heart in the forest," said a grateful fox. Henry realized that being different wasn't bad—what mattered was how you treated others.`,
            moral: 'Kindness and helping others brings true friendship and joy.',
            readingTime: 3,
            characters: ['Henry the Hedgehog', 'Baby Bird', 'Mother Bird', 'Forest Animals']
        },
        {
            id: 10,
            title: 'The Rainbow Fish',
            emoji: '🐠',
            description: 'A beautiful fish learns the joy of sharing.',
            content: `In a sparkling ocean lived a fish named Rainbow with the most beautiful scales in the entire sea. Her scales shimmered with every color of the rainbow.

Rainbow was very proud of her beauty and didn't want to share. When other fish admired her scales, she would swim away quickly. She had no friends because of her selfishness.

One day, a sad little fish asked, "Could you share just one of your special scales? I want to be beautiful too."

Rainbow refused. "These scales are mine and mine alone!" she said coldly and swam away.

As time passed, Rainbow felt more and more lonely. She realized that her beauty meant nothing without friends to share it with.

One day, Rainbow decided to change. She gave one special scale to the sad little fish. The little fish's face lit up with joy!

Rainbow gave scales to more friends, and something magical happened. Each fish who received a scale became special and beautiful in their own way.

Soon, Rainbow was surrounded by beautiful friends who loved her not for her scales, but for her kind heart.

"Rainbow, you're the most beautiful because you have a beautiful soul," said one grateful friend.

Rainbow learned that sharing brings more joy than keeping everything for yourself.`,
            moral: 'Sharing brings more joy and friendship than keeping things all to yourself.',
            readingTime: 3,
            characters: ['Rainbow the Fish', 'Sad Little Fish', 'Ocean Friends']
        },
        {
            id: 11,
            title: 'The Dancing Flamingo',
            emoji: '🦩',
            description: 'A flamingo learns to be confident in being unique.',
            content: `In a beautiful lagoon lived a flamingo named Fiona who loved to dance. But unlike other flamingos who danced in perfect lines, Fiona danced her own way with unique, creative moves.

The other flamingos laughed. "That's not how we dance! Follow the steps!" they said sternly.

Fiona felt hurt and tried to dance like everyone else. But her feet wouldn't follow the rules. She wanted to move freely and create her own dance.

One day, a group of visiting birds arrived to watch the flamingos dance. The regular flamingos danced perfectly in lines, but their dance was boring.

Then Fiona danced, and the visiting birds were amazed! Her unique moves were beautiful and full of joy. The other flamingos watched in wonder as the visitors clapped and cheered.

"Your dance is magical!" they said to Fiona. "It's so different and wonderful!"

The other flamingos realized that being different wasn't bad. Fiona taught them new dance moves that were fun and creative.

Soon, the whole flock was dancing in their own unique ways, and the lagoon became the most beautiful and joyful place in the world.`,
            moral: 'Being yourself and unique is more beautiful than trying to fit in.',
            readingTime: 3,
            characters: ['Fiona the Flamingo', 'Other Flamingos', 'Visiting Birds']
        },
        {
            id: 12,
            title: 'The Turtle\'s Lesson',
            emoji: '🐢',
            description: 'A slow turtle wins a race by staying determined.',
            content: `In a peaceful pond lived a slow turtle named Terry who moved very slowly. A fast rabbit named Rascal often teased him about his slow speed.

"Let's have a race!" challenged Rascal with a laugh. "I'll finish before you even reach halfway!"

"Okay," agreed Terry candy. "I will race you to the other side of the forest."

They started the race, and Rascal zoomed ahead so fast that he disappeared. He was so far ahead that he decided to take a nap under a tree, thinking Terry would never catch up.

Meanwhile, Terry kept moving steadily. Slow and steady, step by step. He didn't stop or get discouraged. He just kept going.

When Terry passed the sleeping Rascal and continued forward, he finally reached the finish line!

Rascal woke up and ran as fast as he could, but it was too late. Terry had already won!

"How did you beat me?" asked Rascal in shock.

Terry smiled. "I didn't stop or give up. I knew I was slower, but I stayed determined and never quit. That's how I won."

Rascal learned that speed isn't everything. Determination, consistency, and never giving up matter much more.`,
            moral: 'Determination and persistence matter more than natural talent.',
            readingTime: 4,
            characters: ['Terry the Turtle', 'Rascal the Rabbit']
        }
    ];

    selectedStory: Story | null = null;
    selectedStoryIndex: number = -1;
    showStoryModal: boolean = false;
    showCelebration: boolean = false;
    completedStories: Set<number> = new Set();
    completedCount: number = 0;

    // Voice selection properties
    availableVoices: SpeechSynthesisVoice[] = [];
    selectedVoiceIndex: number = 0;

    constructor(
        private dataService: DataService,
        private router: Router,
        private audio: AudioService,
        private mascot: MascotService,
        public settingsService: SettingsService
    ) { }

    ngOnInit(): void {
        this.loadAvailableVoices();

        // Narrate instructions on load
        setTimeout(() => {
            if (this.settingsService.narrationEnabledValue) {
                this.speak("Welcome to Story Time! Choose a book to read or listen aloud.");
            }
        }, 800);
    }

    loadAvailableVoices(): void {
        const voices = window.speechSynthesis.getVoices();
        this.availableVoices = voices.filter(voice => voice.lang.startsWith('en'));
        if (this.availableVoices.length === 0) {
            this.availableVoices = voices;
        }
        // Load voice index from global settings
        this.selectedVoiceIndex = this.settingsService.selectedVoiceIndexValue;
        if (this.selectedVoiceIndex >= this.availableVoices.length) {
            this.selectedVoiceIndex = 0;
        }
    }

    getVoiceName(voice: SpeechSynthesisVoice): string {
        return `${voice.name}${voice.default ? ' (Default)' : ''}`;
    }

    onVoiceChanged(): void {
        this.settingsService.setSelectedVoiceIndex(Number(this.selectedVoiceIndex));
    }

    playVoiceDemo(): void {
        this.speak('Story time is fun!');
    }

    selectStory(story: Story, index: number): void {
        this.selectedStory = story;
        this.selectedStoryIndex = index;
        this.showStoryModal = true;

        // Auto announce story title
        setTimeout(() => {
            if (this.settingsService.narrationEnabledValue && story) {
                this.speak(`Now reading: ${story.title}`);
            }
        }, 400);
    }

    closeModal(): void {
        this.stopSpeaking();
        this.showStoryModal = false;
        this.selectedStory = null;
        this.selectedStoryIndex = -1;
    }

    markAsCompleted(): void {
        if (this.selectedStoryIndex >= 0) {
            this.completedStories.add(this.selectedStoryIndex);
            this.completedCount = this.completedStories.size;
            const child = this.dataService.getCurrentChild();
            if (child) {
                this.dataService.updateChildProgress(child.id, 'stories', 30);
            }
            this.audio.play('success');
            this.mascot.celebrate(`Wonderful reading! You finished ${this.selectedStory?.title}!`);

            setTimeout(() => {
                this.closeModal();
            }, 800);
        }
    }

    isCompleted(index: number): boolean {
        return this.completedStories.has(index);
    }

    speak(text: string): void {
        window.speechSynthesis.cancel();
        this.mascot.think('Reading aloud...');

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;
        utterance.pitch = 1.35;
        utterance.volume = 1;

        const voiceIdx = this.settingsService.selectedVoiceIndexValue;
        if (this.availableVoices.length > 0 && voiceIdx < this.availableVoices.length) {
            utterance.voice = this.availableVoices[voiceIdx];
        }

        window.speechSynthesis.speak(utterance);
    }

    stopSpeaking(): void {
        window.speechSynthesis.cancel();
    }

    completeLearning(): void {
        this.showCelebration = true;
        this.audio.play('levelUp');
        this.mascot.celebrate('Story Castle complete!');
        setTimeout(() => {
            window.speechSynthesis.cancel();
            this.router.navigate(['/dashboard']);
        }, 2000);
    }

    goBack(): void {
        window.speechSynthesis.cancel();
        this.router.navigate(['/dashboard']);
    }
}

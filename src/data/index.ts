import { Edition, Project } from '../types';

import e2016 from './editions/2016.json';
import e2017 from './editions/2017.json';
import e2018 from './editions/2018.json';
import e2020 from './editions/2020.json';
import e2021 from './editions/2021.json';
import e2022 from './editions/2022.json';
import e2023 from './editions/2023.json';
import e2024 from './editions/2024.json';
import e2025 from './editions/2025.json';

export const EDITIONS: Edition[] = [
  e2016 as unknown as Edition,
  e2017 as unknown as Edition,
  e2018 as unknown as Edition,
  e2020 as unknown as Edition,
  e2021 as unknown as Edition,
  e2022 as unknown as Edition,
  e2023 as unknown as Edition,
  e2024 as unknown as Edition,
  e2025 as unknown as Edition,
];

export function getEditions(): Edition[] {
  return EDITIONS;
}

export function getEdition(year: string): Edition | undefined {
  return EDITIONS.find((e) => e.year === year || (year === '2019' && e.year === '2020'));
}

export type EnrichedProject = Project & {
  editionYear: string;
  editionNumber: number;
  editionTitle: string;
};

export function getAllProjects(): EnrichedProject[] {
  const result: EnrichedProject[] = [];
  for (const edition of EDITIONS) {
    for (const project of edition.projects) {
      result.push({
        ...project,
        editionYear: edition.year,
        editionNumber: edition.editionNumber,
        editionTitle: edition.title,
      });
    }
  }
  return result;
}

export function getProject(id: string): EnrichedProject | undefined {
  return getAllProjects().find((p) => p.id === id);
}

export function getTopAwardWinners(): EnrichedProject[] {
  return getAllProjects().filter((p) => p.awardTier === 'first');
}

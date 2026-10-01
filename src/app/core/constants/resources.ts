import { ResourceConfig, ResourceKind } from '../models/resource.models';

export const RESOURCE_CONFIG: Record<ResourceKind, ResourceConfig> = {
  people: { kind: 'people', label: 'Personnages', singular: 'Personnage', icon: '◈', accent: 'cyan', fields: ['gender', 'birthYear', 'height', 'homeworld'] },
  planets: { kind: 'planets', label: 'Planètes', singular: 'Planète', icon: '◉', accent: 'purple', fields: ['climate', 'terrain', 'population'] },
  films: { kind: 'films', label: 'Films', singular: 'Film', icon: '▣', accent: 'magenta', fields: ['episodeId', 'director', 'releaseDate'] },
  starships: { kind: 'starships', label: 'Vaisseaux', singular: 'Vaisseau', icon: '✦', accent: 'green', fields: ['model', 'manufacturer', 'starshipClass'] }
};

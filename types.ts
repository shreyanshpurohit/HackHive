// Shared app-level shapes. Keep component-local types beside the component that owns them.
export interface Project {
  id: string;
  title: string;
  tags: string[];
  image: string;
  description: string;
}
//hi bro
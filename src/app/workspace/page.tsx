"use client";

import { useMemo, useState } from "react";

type ItineraryStop = {
  id: string;
  dayRange: string;
  title: string;
  location: string;
};

type SafariProject = {
  id: string;
  name: string;
  nights: number;
  notes: string;
  itinerary: ItineraryStop[];
};

const sampleCampOptions = [
  {
    id: "camp-1",
    name: "Nyumbani Tarangire",
    location: "Tarangire National Park",
  },
  {
    id: "camp-2",
    name: "Nyumbani Serengeti",
    location: "Serengeti National Park",
  },
  {
    id: "camp-3",
    name: "Nyumbani Ngorongoro",
    location: "Ngorongoro Highlands",
  },
];

export default function WorkspacePage() {
  const [projects, setProjects] = useState<SafariProject[]>([
    {
      id: "1",
      name: "Honeymoon Safari – June",
      nights: 10,
      notes:
        "Luxury couple. Wants strong wildlife density, romantic atmosphere, and balloon safari.",
      itinerary: [
        {
          id: "stop-1",
          dayRange: "Day 1–2",
          title: "Nyumbani Tarangire",
          location: "Tarangire National Park",
        },
        {
          id: "stop-2",
          dayRange: "Day 3–4",
          title: "Nyumbani Ngorongoro",
          location: "Ngorongoro Highlands",
        },
        {
          id: "stop-3",
          dayRange: "Day 5–8",
          title: "Nyumbani Serengeti",
          location: "Serengeti National Park",
        },
      ],
    },
    {
      id: "2",
      name: "Family Safari – August",
      nights: 8,
      notes:
        "Family with children. Wants softer pacing, strong guiding, and warm hospitality.",
      itinerary: [
        {
          id: "stop-4",
          dayRange: "Day 1–2",
          title: "Nyumbani Tarangire",
          location: "Tarangire National Park",
        },
      ],
    },
  ]);

  const [newProject, setNewProject] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("1");

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? projects[0],
    [projects, selectedProjectId],
  );

  function createProject() {
    if (!newProject.trim()) return;

    const project: SafariProject = {
      id: Date.now().toString(),
      name: newProject.trim(),
      nights: 7,
      notes: "",
      itinerary: [],
    };

    setProjects((prev) => [...prev, project]);
    setSelectedProjectId(project.id);
    setNewProject("");
  }

  function updateProjectNotes(value: string) {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === selectedProjectId ? { ...project, notes: value } : project,
      ),
    );
  }

  function addCampToItinerary(camp: { name: string; location: string }) {
    if (!selectedProject) return;

    const nextIndex = selectedProject.itinerary.length + 1;
    const newStop: ItineraryStop = {
      id: `${selectedProject.id}-${Date.now()}`,
      dayRange: `Day ${nextIndex}`,
      title: camp.name,
      location: camp.location,
    };

    setProjects((prev) =>
      prev.map((project) =>
        project.id === selectedProjectId
          ? { ...project, itinerary: [...project.itinerary, newStop] }
          : project,
      ),
    );
  }

  function removeStop(stopId: string) {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === selectedProjectId
          ? {
              ...project,
              itinerary: project.itinerary.filter((stop) => stop.id !== stopId),
            }
          : project,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-white/40">
            Safari Workspace
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Build safari itineraries faster
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/65">
            Create safari projects, shortlist camps, shape itinerary flow, and
            move from matching to proposal-building in one place.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-white/40">
                New Project
              </p>

              <div className="mt-4 flex gap-3">
                <input
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  placeholder="New safari project"
                  className="flex-1 rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none"
                />
                <button
                  onClick={createProject}
                  className="rounded-2xl bg-amber-400 px-5 py-3 text-sm font-semibold text-neutral-950"
                >
                  Create
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-4">
              <p className="px-2 text-sm uppercase tracking-[0.18em] text-white/40">
                Safari Projects
              </p>

              <div className="mt-4 space-y-3">
                {projects.map((project) => {
                  const isActive = project.id === selectedProjectId;

                  return (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProjectId(project.id)}
                      className={`w-full rounded-[22px] border p-4 text-left transition ${
                        isActive
                          ? "border-amber-300/20 bg-amber-300/[0.08]"
                          : "border-white/10 bg-black/20 hover:bg-white/[0.04]"
                      }`}
                      type="button"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-base font-semibold">{project.name}</h2>
                          <p className="mt-2 text-sm text-white/55">
                            {project.nights} nights
                          </p>
                        </div>

                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white/50">
                          {project.itinerary.length} stops
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            {selectedProject ? (
              <>
                <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-6 md:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-6">
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-white/40">
                        Active Safari
                      </p>
                      <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                        {selectedProject.name}
                      </h2>
                      <p className="mt-3 text-sm text-white/60">
                        {selectedProject.nights} nights planned
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href="/match"
                        className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950"
                      >
                        Match Camps
                      </a>
                      <a
                        href="/compare"
                        className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Compare
                      </a>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.18em] text-white/40">
                          Safari Builder
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold">
                          Itinerary flow
                        </h3>
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      {selectedProject.itinerary.length > 0 ? (
                        selectedProject.itinerary.map((stop) => (
                          <div
                            key={stop.id}
                            className="rounded-[26px] border border-white/10 bg-black/20 p-5"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-amber-100/70">
                                  {stop.dayRange}
                                </p>
                                <h4 className="mt-2 text-xl font-semibold">
                                  {stop.title}
                                </h4>
                                <p className="mt-2 text-sm text-white/60">
                                  {stop.location}
                                </p>
                              </div>

                              <button
                                onClick={() => removeStop(stop.id)}
                                className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white"
                                type="button"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-[26px] border border-dashed border-white/15 bg-black/20 p-8 text-white/55">
                          No itinerary stops yet. Add camps from the shortlist panel.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
                      <p className="text-sm uppercase tracking-[0.18em] text-white/40">
                        Camp Shortlist
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold">
                        Add camps to safari
                      </h3>

                      <div className="mt-6 space-y-4">
                        {sampleCampOptions.map((camp) => (
                          <div
                            key={camp.id}
                            className="rounded-[24px] border border-white/10 bg-black/20 p-4"
                          >
                            <h4 className="text-lg font-semibold">{camp.name}</h4>
                            <p className="mt-2 text-sm text-white/60">
                              {camp.location}
                            </p>

                            <button
                              onClick={() => addCampToItinerary(camp)}
                              className="mt-4 rounded-2xl bg-amber-400 px-4 py-2 text-sm font-semibold text-neutral-950"
                              type="button"
                            >
                              Add to Itinerary
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
                      <p className="text-sm uppercase tracking-[0.18em] text-white/40">
                        Project Notes
                      </p>
                      <textarea
                        value={selectedProject.notes}
                        onChange={(e) => updateProjectNotes(e.target.value)}
                        rows={8}
                        className="mt-5 w-full rounded-[24px] border border-white/10 bg-black/20 p-4 text-sm leading-7 text-white/75 outline-none"
                        placeholder="Add client notes, trip priorities, routing ideas, or special requests..."
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-10">
                <h2 className="text-2xl font-semibold">No active safari project</h2>
                <p className="mt-3 text-white/60">
                  Create a new safari project to begin planning.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

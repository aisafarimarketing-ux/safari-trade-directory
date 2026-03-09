"use client";

import { useState } from "react";

type SafariProject = {
  id: string;
  name: string;
  nights: number;
  notes?: string;
};

export default function WorkspacePage() {

  const [projects, setProjects] = useState<SafariProject[]>([
    {
      id: "1",
      name: "Honeymoon Safari – June",
      nights: 10,
    },
    {
      id: "2",
      name: "Family Safari – August",
      nights: 8,
    },
  ]);

  const [newProject, setNewProject] = useState("");

  function createProject() {
    if (!newProject) return;

    const project = {
      id: Date.now().toString(),
      name: newProject,
      nights: 7,
    };

    setProjects([...projects, project]);
    setNewProject("");
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">

      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Title */}

        <h1 className="text-4xl font-semibold tracking-tight">
          Safari Workspace
        </h1>

        <p className="text-white/60 mt-3">
          Create safari projects and plan itineraries for your clients.
        </p>

        {/* Create project */}

        <div className="mt-10 flex gap-3">

          <input
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            placeholder="New safari project"
            className="flex-1 border border-white/15 bg-black/30 px-4 py-3 rounded-xl outline-none"
          />

          <button
            onClick={createProject}
            className="bg-amber-400 text-black px-6 py-3 rounded-xl font-semibold"
          >
            Create
          </button>

        </div>

        {/* Projects */}

        <div className="grid md:grid-cols-3 gap-6 mt-12">

          {projects.map((project) => (

            <div
              key={project.id}
              className="border border-white/10 bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition"
            >

              <h3 className="text-xl font-semibold">
                {project.name}
              </h3>

              <p className="text-white/60 text-sm mt-2">
                {project.nights} nights
              </p>

              <div className="flex gap-3 mt-6">

                <a
                  href="/match"
                  className="border border-white/20 px-4 py-2 rounded-lg text-sm"
                >
                  Match Camps
                </a>

                <a
                  href="/compare"
                  className="border border-white/20 px-4 py-2 rounded-lg text-sm"
                >
                  Compare
                </a>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}

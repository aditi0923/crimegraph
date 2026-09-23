import { useEffect, useState } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [cases, setCases] = useState([]);
  const [persons, setPersons] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedRelationship, setSelectedRelationship] = useState(null);

  const [caseFilter, setCaseFilter] = useState("ALL");
  const [caseSearch, setCaseSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [relationshipFilter, setRelationshipFilter] = useState("ALL");
  const [showCaseForm, setShowCaseForm] = useState(false);
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [personSearch, setPersonSearch] = useState("");
const [personFilter, setPersonFilter] = useState("ALL");
  const [showRelationshipForm, setShowRelationshipForm] = useState(false);

  const [newCase, setNewCase] = useState({
    caseNumber: "", title: "", description: "", status: "OPEN",
  });
  const [newPerson, setNewPerson] = useState({
    name: "", phone: "", address: "", status: "PERSON_OF_INTEREST",
  });
  const [newRelationship, setNewRelationship] = useState({
    sourcePersonId: "", targetPersonId: "", relationshipType: "CALLED", description: "",
  });

  useEffect(() => {
    axios.get("http://localhost:8080/api/cases").then((r) => setCases(r.data)).catch(console.error);
    axios.get("http://localhost:8080/api/persons").then((r) => setPersons(r.data)).catch(console.error);
    axios.get("http://localhost:8080/api/relationships").then((r) => setRelationships(r.data)).catch(console.error);
  }, []);

  const filteredCases = cases.filter((c) => {
  const matchesSearch =
    c.caseNumber?.toLowerCase().includes(caseSearch.toLowerCase()) ||
    c.title?.toLowerCase().includes(caseSearch.toLowerCase());

  const matchesStatus =
    caseFilter === "ALL" || c.status === caseFilter;

  return matchesSearch && matchesStatus;
});

  const filteredPersons = persons.filter((person) => {
  const search = personSearch.toLowerCase();

  const matchesSearch =
    person.name?.toLowerCase().includes(search) ||
    person.phone?.toLowerCase().includes(search);

  const matchesStatus =
    personFilter === "ALL" || person.status === personFilter;

  return matchesSearch && matchesStatus;
});
  const filteredRelationships = relationships.filter((item) =>
    relationshipFilter === "ALL" || item.relationshipType === relationshipFilter
  );

  const openCases = cases.filter((c) => c.status === "OPEN").length;
  const closedCases = cases.filter((c) => c.status === "CLOSED").length;
  const inProgressCases = cases.filter((c) => c.status === "IN_PROGRESS").length;

  const connectedPersonIds = new Set();
  if (selectedPerson) {
    relationships.forEach((r) => {
      if (r.sourcePersonId === selectedPerson.id) connectedPersonIds.add(r.targetPersonId);
      if (r.targetPersonId === selectedPerson.id) connectedPersonIds.add(r.sourcePersonId);
    });
  }

  const nodes = filteredPersons.map((person, index) => {
    const isSelected = selectedPerson?.id === person.id;
    const isConnected = selectedPerson && connectedPersonIds.has(person.id);
    let background = person.status === "WITNESS" ? "#166534" : "#991B1B";

    if (selectedPerson && !isSelected && !isConnected) background = "#374151";

    return {
      id: String(person.id),
      position: { x: (index % 3) * 300, y: Math.floor(index / 3) * 180 },
      data: { label: `👤 ${person.name}` },
      style: {
        padding: "12px",
        borderRadius: "8px",
        background,
        color: "white",
        border: isSelected ? "4px solid #FACC15" : "2px solid white",
      },
    };
  });

  const edges = filteredRelationships.map((r) => {
    const color = r.relationshipType === "CALLED" ? "#3B82F6"
      : r.relationshipType === "MET" ? "#22C55E" : "#A855F7";

    return {
      id: String(r.id),
      source: String(r.sourcePersonId),
      target: String(r.targetPersonId),
      label: r.relationshipType,
      style: { stroke: color, strokeWidth: 2 },
      labelStyle: { fill: color, fontWeight: 600, fontSize: 12 },
    };
  });

  const resetFilters = () => {
    setSearchTerm("");
    setRelationshipFilter("ALL");
    setCaseFilter("ALL");
    setSelectedPerson(null);
    setSelectedRelationship(null);
  };

  const saveCase = () => {
  axios
    .post("http://localhost:8080/api/cases", newCase)
    .then(() => {
      alert("Case added successfully!");
      window.location.reload();
    })
    .catch((error) => {
      console.error(error);
      alert("Failed to add case");
    });
};
const deleteCase = (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this case?"
  );

  if (!confirmDelete) return;

  axios
    .delete(`http://localhost:8080/api/cases/${id}`)
    .then(() => {
      alert("Case deleted successfully!");
      window.location.reload();
    })
    .catch((error) => {
      console.error(error);
      alert("Failed to delete case");
    });
};

  const savePerson = () => {
    axios.post("http://localhost:8080/api/persons", newPerson)
      .then(() => window.location.reload()).catch(console.error);
  };

  const saveRelationship = () => {
    axios.post("http://localhost:8080/api/relationships", {
      ...newRelationship,
      sourcePersonId: Number(newRelationship.sourcePersonId),
      targetPersonId: Number(newRelationship.targetPersonId),
    }).then(() => window.location.reload()).catch(console.error);
  };

  const inputStyle = { display: "block", width: "100%", boxSizing: "border-box", padding: "10px", margin: "10px 0", borderRadius: "6px" };
  const buttonStyle = { padding: "10px 15px", margin: "5px", borderRadius: "6px", cursor: "pointer" };
  const panelStyle = { background: "#1f2937", padding: "20px", borderRadius: "10px", marginBottom: "20px" };

  if (!isLoggedIn) {
    return (
      <div style={{ height: "100vh", background: "#111827", display: "flex", justifyContent: "center", alignItems: "center", color: "white" }}>
        <div style={{ width: "350px", padding: "35px", background: "#1f2937", borderRadius: "12px", textAlign: "center" }}>
          <h1>🔗 CrimeGraph</h1>
          <p>Investigation Intelligence Platform</p>
          <input placeholder="Username" style={inputStyle} />
          <input type="password" placeholder="Password" style={inputStyle} />
          <button onClick={() => setIsLoggedIn(true)} style={{ ...buttonStyle, width: "100%" }}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#111827", color: "white" }}>
      <header style={{ padding: "20px", background: "#1f2937", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>🔗 CrimeGraph</h1>
        <button onClick={() => setIsLoggedIn(false)} style={{ ...buttonStyle, background: "#DC2626", color: "white" }}>🚪 Logout</button>
      </header>

      <div style={{ display: "flex", minHeight: "calc(100vh - 85px)" }}>
        <aside style={{ width: "220px", padding: "20px", background: "#1f2937" }}>
          <h3>Navigation</h3>
          {[
            ["dashboard", "📊 Dashboard"],
            ["cases", "📁 Cases"],
            ["persons", "👤 Persons"],
            ["graph", "🔗 Relationship Graph"],
          ].map(([section, label]) => (
            <button key={section} onClick={() => setActiveSection(section)}
              style={{ ...buttonStyle, width: "100%", background: activeSection === section ? "#2563EB" : "#374151", color: "white", border: "none" }}>
              {label}
            </button>
          ))}
        </aside>

        <main style={{ flex: 1, padding: "25px", overflowY: "auto" }}>
          <h2>
            {activeSection === "dashboard" && "📊 Dashboard"}
            {activeSection === "cases" && "📁 Cases"}
            {activeSection === "persons" && "👤 Persons"}
            {activeSection === "graph" && "🔗 Relationship Graph"}
          </h2>

         
{activeSection === "dashboard" && (
  <div>
    <p>Welcome to CrimeGraph. Monitor investigation data from one place.</p>

    {/* Statistics Cards */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "15px",
      }}
    >
      {[
        ["📁 Total Cases", cases.length],
        ["🟢 Open Cases", openCases],
        ["✅ Closed Cases", closedCases],
        ["⏳ In Progress", inProgressCases],
        ["👤 Persons", persons.length],
        ["🔗 Relationships", relationships.length],
      ].map(([label, value]) => (
        <div key={label} style={panelStyle}>
          <h3>{label}</h3>
          <h1>{value}</h1>
        </div>
      ))}
    </div>

    {/* Recent Cases */}
    <div style={{ ...panelStyle, marginTop: "25px" }}>
      <h2>📋 Recent Cases</h2>

      {cases.length === 0 ? (
        <p>No cases available.</p>
      ) : (
        cases.slice(-5).reverse().map((item) => (
          <div
            key={item.id}
            style={{
              padding: "12px",
              marginTop: "10px",
              background: "#374151",
              borderRadius: "8px",
            }}
          >
            <b>{item.caseNumber}</b>
            <p>{item.title}</p>
            <small>Status: {item.status}</small>
          </div>
        ))
      )}
    </div>

    {/* Quick Actions */}
    <div style={{ ...panelStyle, marginTop: "25px" }}>
      <h2>⚡ Quick Actions</h2>

      <button
        onClick={() => setActiveSection("cases")}
        style={buttonStyle}
      >
        📁 View Cases
      </button>

      <button
        onClick={() => setActiveSection("persons")}
        style={buttonStyle}
      >
        👤 View Persons
      </button>

      <button
        onClick={() => setActiveSection("graph")}
        style={buttonStyle}
      >
        🔗 Open Graph
      </button>
    </div>
  </div>
)}

          
{activeSection === "cases" && (
  <div style={{ padding: "30px" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <h2>📁 Case Management</h2>

      <button
  type="button"
  onClick={() => setShowCaseForm(true)}
  style={buttonStyle}
>
  ➕ Add Case
</button>

{showCaseForm && (
  <div style={panelStyle}>
    <h3>➕ Add New Case</h3>

    <input
      type="text"
      placeholder="Case Number"
      value={newCase.caseNumber}
      onChange={(e) =>
        setNewCase({
          ...newCase,
          caseNumber: e.target.value
        })
      }
      style={inputStyle}
    />

    <input
      type="text"
      placeholder="Case Title"
      value={newCase.title}
      onChange={(e) =>
        setNewCase({
          ...newCase,
          title: e.target.value
        })
      }
      style={inputStyle}
    />

    <textarea
      placeholder="Case Description"
      value={newCase.description}
      onChange={(e) =>
        setNewCase({
          ...newCase,
          description: e.target.value
        })
      }
      style={inputStyle}
    />

    <select
      value={newCase.status}
      onChange={(e) =>
        setNewCase({
          ...newCase,
          status: e.target.value
        })
      }
      style={inputStyle}
    >
      <option value="OPEN">OPEN</option>
      <option value="IN_PROGRESS">IN PROGRESS</option>
      <option value="CLOSED">CLOSED</option>
    </select>

    <button onClick={saveCase} style={buttonStyle}>
      Save Case
    </button>

    <button
      onClick={() => setShowCaseForm(false)}
      style={buttonStyle}
    >
      Cancel
    </button>
  </div>
)}
    </div>

    {/* Search and Filter */}
    <div
      style={{
        display: "flex",
        gap: "10px",
        margin: "20px 0",
        flexWrap: "wrap",
      }}
    >
      <input
        placeholder="🔍 Search cases..."
        value={caseSearch}
        onChange={(e) => setCaseSearch(e.target.value)}
        style={inputStyle}
      />

      <select
        value={caseFilter}
        onChange={(e) => setCaseFilter(e.target.value)}
        style={inputStyle}
      >
        <option value="ALL">All Cases</option>
        <option value="OPEN">OPEN</option>
        <option value="CLOSED">CLOSED</option>
        <option value="IN_PROGRESS">IN PROGRESS</option>
      </select>
    </div>

    <p>Total Cases: {filteredCases.length}</p>

    {filteredCases.map((caseItem) => (
      <div key={caseItem.id} style={panelStyle}>
        <h3>📁 {caseItem.caseNumber}</h3>
        <p><b>Title:</b> {caseItem.title}</p>
        <p>{caseItem.description}</p>
        <b>Status: {caseItem.status}</b>
        <button
  onClick={() => deleteCase(c.id)}
  style={{
    ...buttonStyle,
    backgroundColor: "red",
    color: "white"
  }}
>
  Delete
</button>
      </div>
    ))}
    
  </div>
)}

         
{activeSection === "persons" && (
  <div style={{ padding: "30px" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <h2>👤 Person Management</h2>

    <button
  type="button"
  onClick={() => setShowPersonForm(true)}
  style={buttonStyle}
>
  ➕ Add Person
</button>
    </div>

    <div style={{ margin: "20px 0" }}>
      <input
        placeholder="🔍 Search by name or phone..."
        value={personSearch}
        onChange={(e) => setPersonSearch(e.target.value)}
        style={{ padding: "10px", marginRight: "10px" }}
      />

      <select
        value={personFilter}
        onChange={(e) => setPersonFilter(e.target.value)}
        style={{ padding: "10px" }}
      >
        <option value="ALL">All Persons</option>
        <option value="PERSON_OF_INTEREST">
          Person of Interest
        </option>
        <option value="WITNESS">Witness</option>
      </select>
    </div>

    <p>Total Persons: {filteredPersons.length}</p>

    {filteredPersons.map((person) => (
      <div
        key={person.id}
        style={{
          background: "#1f2937",
          padding: "20px",
          marginTop: "15px",
          borderRadius: "10px",
        }}
      >
        <h3>👤 {person.name}</h3>
        <p>Phone: {person.phone}</p>
        <p>Address: {person.address}</p>
        <p>Status: {person.status}</p>

        <button onClick={() => setSelectedPerson(person)}>
          View Details
        </button>
      </div>
    ))}
  </div>
)}
          {activeSection === "graph" && (
            <div>
              <div style={panelStyle}>
                <input placeholder="🔍 Search person in graph..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={inputStyle} />
                <select value={relationshipFilter} onChange={(e) => setRelationshipFilter(e.target.value)} style={inputStyle}>
                  <option value="ALL">All Relationships</option><option value="CALLED">CALLED</option><option value="MET">MET</option><option value="ASSOCIATED_WITH">ASSOCIATED_WITH</option>
                </select>
                <button onClick={() => setShowRelationshipForm(!showRelationshipForm)} style={buttonStyle}>➕ Add Relationship</button>
                <button onClick={resetFilters} style={buttonStyle}>🔄 Reset Filters</button>
                {showRelationshipForm && (
                  <div>
                    <h3>Add Relationship</h3>
                    <select value={newRelationship.sourcePersonId} onChange={(e) => setNewRelationship({ ...newRelationship, sourcePersonId: e.target.value })} style={inputStyle}>
                      <option value="">Select Source Person</option>{persons.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <select value={newRelationship.targetPersonId} onChange={(e) => setNewRelationship({ ...newRelationship, targetPersonId: e.target.value })} style={inputStyle}>
                      <option value="">Select Target Person</option>{persons.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <select value={newRelationship.relationshipType} onChange={(e) => setNewRelationship({ ...newRelationship, relationshipType: e.target.value })} style={inputStyle}>
                      <option value="CALLED">CALLED</option><option value="MET">MET</option><option value="ASSOCIATED_WITH">ASSOCIATED_WITH</option>
                    </select>
                    <input placeholder="Description" value={newRelationship.description} onChange={(e) => setNewRelationship({ ...newRelationship, description: e.target.value })} style={inputStyle} />
                    <button onClick={saveRelationship} style={buttonStyle}>Save Relationship</button>
                    <button onClick={() => setShowRelationshipForm(false)} style={buttonStyle}>Cancel</button>
                  </div>
                )}
              </div>
              <div style={{ height: "600px", background: "#1f2937", borderRadius: "10px" }}>
                <ReactFlow nodes={nodes} edges={edges} fitView
                  onNodeClick={(event, node) => setSelectedPerson(persons.find((p) => String(p.id) === node.id))}
                  onEdgeClick={(event, edge) => setSelectedRelationship(relationships.find((r) => String(r.id) === edge.id))}>
                  <MiniMap /><Controls /><Background />
                </ReactFlow>
              </div>
            </div>
          )}

          {selectedPerson && (
            <div style={panelStyle}>
              <h3>👤 Person Details</h3><p>Name: {selectedPerson.name}</p><p>Phone: {selectedPerson.phone}</p><p>Address: {selectedPerson.address}</p><p>Status: {selectedPerson.status}</p>
              <button onClick={() => setSelectedPerson(null)} style={buttonStyle}>Close</button>
            </div>
          )}

          {selectedRelationship && (
            <div style={panelStyle}>
              <h3>🔗 Relationship Details</h3>
              <p>Type: {selectedRelationship.relationshipType}</p>
              <p>Description: {selectedRelationship.description}</p>
              <button onClick={() => setSelectedRelationship(null)} style={buttonStyle}>Close</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

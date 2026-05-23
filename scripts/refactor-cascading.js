const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..');

function fixFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { target, replacement } of replacements) {
    if (!content.includes(target)) {
      console.warn(`WARNING: Target string not found in ${path.basename(filePath)}:\n${target.substring(0, 100)}...`);
      continue;
    }
    content = content.replace(target, replacement);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully updated ${path.basename(filePath)}`);
}

// 1. useCandidates.tsx
fixFile(
  path.join(srcDir, 'app/empresa-perfil/buscar-candidatos/hooks/useCandidates.tsx'),
  [
    {
      target: '  const [candidates, setCandidates] = useState<CandidateSearchResult[]>([]);\n  const [total, setTotal] = useState(0);\n  const [loading, setLoading] = useState(true);',
      replacement: '  const [state, setState] = useState({\n    candidates: [] as CandidateSearchResult[],\n    total: 0,\n    loading: true,\n  });\n  const { candidates, total, loading } = state;'
    },
    {
      target: '      try {\n        const result = await searchCandidates(',
      replacement: '      setState((prev) => ({ ...prev, loading: true }));\n      try {\n        const result = await searchCandidates('
    },
    {
      target: '        if (result) {\n          setTotal(result.totalItems);\n          setCandidates(result.data);\n        } else {\n          setTotal(0);\n          setCandidates([]);\n        }\n      } catch (e: unknown) {\n        if (e instanceof Error && e.name !== "AbortError") {\n          console.error("Error loading candidates:", e);\n        }\n        setTotal(0);\n        setCandidates([]);\n      } finally {\n        setLoading(false);\n      }',
      replacement: '        if (result) {\n          setState({\n            candidates: result.data,\n            total: result.totalItems,\n            loading: false,\n          });\n        } else {\n          setState({\n            candidates: [],\n            total: 0,\n            loading: false,\n          });\n        }\n      } catch (e: unknown) {\n        if (e instanceof Error && e.name !== "AbortError") {\n          console.error("Error loading candidates:", e);\n        }\n        setState({\n          candidates: [],\n          total: 0,\n          loading: false,\n        });\n      }'
    }
  ]
);

// 2. app/auth/email/page.tsx
fixFile(
  path.join(srcDir, 'app/auth/email/page.tsx'),
  [
    {
      target: '  const [fields, setFields] = useState<SignUpFieldsResponse | null>(null);\n  const [loadingFields, setLoadingFields] = useState(true);\n  const [ciudades, setCiudades] = useState<CatalogsByType[]>([]);\n  const [provincias, setProvincias] = useState<CatalogsByType[]>([]);',
      replacement: '  const [state, setState] = useState({\n    fields: null as SignUpFieldsResponse | null,\n    loadingFields: true,\n    ciudades: [] as CatalogsByType[],\n    provincias: [] as CatalogsByType[],\n  });\n  const { fields, loadingFields, ciudades, provincias } = state;'
    },
    {
      target: '        setFields(fetchedFields);\n        if (ciudadesRes?.data) setCiudades(ciudadesRes.data);\n        if (provinciasRes?.data) setProvincias(provinciasRes.data);\n      } finally {\n        setLoadingFields(false);\n      }',
      replacement: '        setState({\n          fields: fetchedFields,\n          ciudades: ciudadesRes?.data || [],\n          provincias: provinciasRes?.data || [],\n          loadingFields: false,\n        });\n      } catch (err) {\n        setState((prev) => ({ ...prev, loadingFields: false }));\n      }'
    }
  ]
);

// 3. AdminBlogsClient.tsx
fixFile(
  path.join(srcDir, 'app/admin/blogs/components/AdminBlogsClient.tsx'),
  [
    {
      target: '  const [blogs, setBlogs] = useState<AdminBlog[]>([]);\n  const [loading, setLoading] = useState(true);\n  const [totalItems, setTotalItems] = useState(0);',
      replacement: '  const [state, setState] = useState({\n    blogs: [] as AdminBlog[],\n    loading: true,\n    totalItems: 0,\n  });\n  const { blogs, loading, totalItems } = state;'
    },
    {
      target: '    const fetchData = async () => {\n      setLoading(true);',
      replacement: '    const fetchData = async () => {\n      setState((prev) => ({ ...prev, loading: true }));'
    },
    {
      target: '        if (response?.data) {\n          setBlogs(response.data.data ?? []);\n          setTotalItems(response.data.totalItems ?? 0);\n        }\n      } catch {\n        console.error("Error fetching blogs");\n      } finally {\n        setLoading(false);\n      }',
      replacement: '        if (response?.data) {\n          setState({\n            blogs: response.data.data ?? [],\n            totalItems: response.data.totalItems ?? 0,\n            loading: false,\n          });\n        } else {\n          setState((prev) => ({ ...prev, loading: false }));\n        }\n      } catch {\n        console.error("Error fetching blogs");\n        setState((prev) => ({ ...prev, loading: false }));\n      }'
    }
  ]
);

// 4. app/admin/usuarios/page.tsx
fixFile(
  path.join(srcDir, 'app/admin/usuarios/page.tsx'),
  [
    {
      target: '  const [usuarios, setUsuarios] = useState<AdminUsuario[]>([]);\n  const [loading, setLoading] = useState(true);',
      replacement: '  const [state, setState] = useState({\n    usuarios: [] as AdminUsuario[],\n    loading: true,\n  });\n  const { usuarios, loading } = state;'
    },
    {
      target: '    const fetchUsuarios = async () => {\n      setLoading(true);\n      await new Promise<void>((resolve) => {\n        timerId = setTimeout(resolve, 500);\n      });\n      if (cancelled) return;\n      setUsuarios(getMockUsuarios());\n      setLoading(false);\n    };',
      replacement: '    const fetchUsuarios = async () => {\n      setState((prev) => ({ ...prev, loading: true }));\n      await new Promise<void>((resolve) => {\n        timerId = setTimeout(resolve, 500);\n      });\n      if (cancelled) return;\n      setState({\n        usuarios: getMockUsuarios(),\n        loading: false,\n      });\n    };'
    },
    {
      target: '      // Refresh the list\n      setUsuarios(getMockUsuarios());',
      replacement: '      // Refresh the list\n      setState((prev) => ({ ...prev, usuarios: getMockUsuarios() }));'
    },
    {
      target: '      toggleUsuarioStatusMock(idUsuario);\n      setUsuarios(getMockUsuarios());',
      replacement: '      toggleUsuarioStatusMock(idUsuario);\n      setState((prev) => ({ ...prev, usuarios: getMockUsuarios() }));'
    },
    {
      target: '        deleteUsuarioMock(usuarioToDelete.idUsuario);\n        setUsuarios(getMockUsuarios());',
      replacement: '        deleteUsuarioMock(usuarioToDelete.idUsuario);\n        setState((prev) => ({ ...prev, usuarios: getMockUsuarios() }));'
    }
  ]
);

// 5. app/admin/page.tsx
fixFile(
  path.join(srcDir, 'app/admin/page.tsx'),
  [
    {
      target: '  const [loading, setLoading] = useState(true);\n  const [kpis, setKpis] = useState<AdminDashboardData | null>(null);\n  const [empresasRecientes, setEmpresasRecientes] = useState<AdminEmpresa[]>([]);\n  const [empleosRecientes, setEmpleosRecientes] = useState<AdminEmpleo[]>([]);',
      replacement: '  const [state, setState] = useState({\n    loading: true,\n    kpis: null as AdminDashboardData | null,\n    empresasRecientes: [] as AdminEmpresa[],\n    empleosRecientes: [] as AdminEmpleo[],\n  });\n  const { loading, kpis, empresasRecientes, empleosRecientes } = state;'
    },
    {
      target: '  useEffect(() => {\n    const fetchData = async () => {\n      const [dashboardRes, empresasRes, empleosRes] = await Promise.all([\n        getAdminDashboard(session?.user?.accessToken),\n        getAdminEmpresas({ pageSize: 4, currentPage: 1 }, session?.user?.accessToken),\n        getAdminEmpleos({ pageSize: 4, currentPage: 1 }, session?.user?.accessToken),\n      ]);\n      if (dashboardRes?.isSuccess) setKpis(dashboardRes.data);\n      if (empresasRes?.isSuccess) setEmpresasRecientes(empresasRes.data.data);\n      if (empleosRes?.isSuccess) setEmpleosRecientes(empleosRes.data.data);\n      setLoading(false);\n    };\n    fetchData();\n  }, [session]);',
      replacement: '  useEffect(() => {\n    const fetchData = async () => {\n      setState((prev) => ({ ...prev, loading: true }));\n      const [dashboardRes, empresasRes, empleosRes] = await Promise.all([\n        getAdminDashboard(session?.user?.accessToken),\n        getAdminEmpresas({ pageSize: 4, currentPage: 1 }, session?.user?.accessToken),\n        getAdminEmpleos({ pageSize: 4, currentPage: 1 }, session?.user?.accessToken),\n      ]);\n      setState({\n        kpis: dashboardRes?.isSuccess ? dashboardRes.data : null,\n        empresasRecientes: empresasRes?.isSuccess ? empresasRes.data.data : [],\n        empleosRecientes: empleosRes?.isSuccess ? empleosRes.data.data : [],\n        loading: false,\n      });\n    };\n    fetchData();\n  }, [session]);'
    }
  ]
);

// 6. app/admin/archivos-empresa/page.tsx
fixFile(
  path.join(srcDir, 'app/admin/archivos-empresa/page.tsx'),
  [
    {
      target: '  // Loading\n  const [loadingEmpresas, setLoadingEmpresas] = useState(false);\n  const [loadingCarpetas, setLoadingCarpetas] = useState(false);\n  const [loadingArchivos, setLoadingArchivos] = useState(false);',
      replacement: '  // Loading\n  const [loadingState, setLoadingState] = useState({\n    loadingEmpresas: false,\n    loadingCarpetas: false,\n    loadingArchivos: false,\n  });\n  const { loadingEmpresas, loadingCarpetas, loadingArchivos } = loadingState;'
    },
    {
      target: '    const load = async () => {\n      setLoadingEmpresas(true);\n      const [empRes, tiposRes] = await Promise.all([\n        getAdminEmpresas(\n          { pageSize: 200, currentPage: 1, sortBy: "nombre", sortDirection: "asc" },\n          token,\n        ),\n        getTiposArchivo(token),\n      ]);\n      if (empRes?.isSuccess && empRes.data) {\n        setEmpresas(empRes.data.data);\n      }\n      if (tiposRes?.isSuccess && tiposRes.data) {\n        setTiposArchivo(tiposRes.data);\n      }\n      setLoadingEmpresas(false);\n    };',
      replacement: '    const load = async () => {\n      setLoadingState((prev) => ({ ...prev, loadingEmpresas: true }));\n      const [empRes, tiposRes] = await Promise.all([\n        getAdminEmpresas(\n          { pageSize: 200, currentPage: 1, sortBy: "nombre", sortDirection: "asc" },\n          token,\n        ),\n        getTiposArchivo(token),\n      ]);\n      if (empRes?.isSuccess && empRes.data) {\n        setEmpresas(empRes.data.data);\n      }\n      if (tiposRes?.isSuccess && tiposRes.data) {\n        setTiposArchivo(tiposRes.data);\n      }\n      setLoadingState((prev) => ({ ...prev, loadingEmpresas: false }));\n    };'
    },
    {
      target: '    const load = async () => {\n      setLoadingCarpetas(true);\n      setLoadingArchivos(true);\n      setCarpetas([]);\n      setArchivos([]);\n      setSelectedCarpetaId(NO_FOLDER);\n\n      const [carpRes, archRes] = await Promise.all([\n        getCarpetasEmpresa(selectedEmpresaId, token),\n        getArchivosEmpresa(selectedEmpresaId, null, token),\n      ]);\n      if (carpRes?.isSuccess && carpRes.data) {\n        setCarpetas(carpRes.data);\n      }\n      if (archRes?.isSuccess && archRes.data) {\n        setArchivos(archRes.data);\n      }\n      setLoadingCarpetas(false);\n      setLoadingArchivos(false);\n    };',
      replacement: '    const load = async () => {\n      setLoadingState({\n        loadingEmpresas: false,\n        loadingCarpetas: true,\n        loadingArchivos: true,\n      });\n      setCarpetas([]);\n      setArchivos([]);\n      setSelectedCarpetaId(NO_FOLDER);\n\n      const [carpRes, archRes] = await Promise.all([\n        getCarpetasEmpresa(selectedEmpresaId, token),\n        getArchivosEmpresa(selectedEmpresaId, null, token),\n      ]);\n      setCarpetas(carpRes?.isSuccess && carpRes.data ? carpRes.data : []);\n      setArchivos(archRes?.isSuccess && archRes.data ? archRes.data : []);\n      setLoadingState({\n        loadingEmpresas: false,\n        loadingCarpetas: false,\n        loadingArchivos: false,\n      });\n    };'
    }
  ]
);

// 7. app/admin/candidatos/page.tsx
fixFile(
  path.join(srcDir, 'app/admin/candidatos/page.tsx'),
  [
    {
      target: '  const [candidatos, setCandidatos] = useState<AdminCandidato[]>([]);\n  const [loading, setLoading] = useState(true);',
      replacement: '  const [state, setState] = useState({\n    candidatos: [] as AdminCandidato[],\n    loading: true,\n  });\n  const { candidatos, loading } = state;'
    },
    {
      target: '    const fetchCandidatos = async () => {\n      setLoading(true);\n      await new Promise<void>((resolve) => {\n        timerId = setTimeout(resolve, 500);\n      });\n      if (cancelled) return;\n      setCandidatos(mockCandidatos);\n      setLoading(false);\n    };',
      replacement: '    const fetchCandidatos = async () => {\n      setState((prev) => ({ ...prev, loading: true }));\n      await new Promise<void>((resolve) => {\n        timerId = setTimeout(resolve, 500);\n      });\n      if (cancelled) return;\n      setState({\n        candidatos: mockCandidatos,\n        loading: false,\n      });\n    };'
    },
    {
      target: '    setCandidatos((prev) =>\n      prev.map((c) =>',
      replacement: '    setState((prev) => ({\n      ...prev,\n      candidatos: prev.candidatos.map((c) =>'
    },
    {
      target: '    setCandidatos((prev) => prev.filter((c) => c.idUsuario !== idUsuario));',
      replacement: '    setState((prev) => ({\n      ...prev,\n      candidatos: prev.candidatos.filter((c) => c.idUsuario !== idUsuario),\n    }));'
    }
  ]
);

// 8. app/empresa-perfil/archivos/page.tsx
fixFile(
  path.join(srcDir, 'app/empresa-perfil/archivos/page.tsx'),
  [
    {
      target: '  const [tiposArchivo, setTiposArchivo] = useState<TipoArchivo[]>([]);\n  const [carpetas, setCarpetas] = useState<CarpetaEmpresa[]>([]);\n  const [loading, setLoading] = useState(true);',
      replacement: '  const [state, setState] = useState({\n    tiposArchivo: [] as TipoArchivo[],\n    carpetas: [] as CarpetaEmpresa[],\n    loading: true,\n  });\n  const { tiposArchivo, carpetas, loading } = state;'
    },
    {
      target: '  const loadCarpetas = async () => {\n    if (!idEmpresa) return;\n    const res = await getCarpetasEmpresa(idEmpresa, token);\n    if (res?.isSuccess) setCarpetas(res.data ?? []);\n  };',
      replacement: '  const loadCarpetas = async () => {\n    if (!idEmpresa) return;\n    const res = await getCarpetasEmpresa(idEmpresa, token);\n    if (res?.isSuccess) {\n      setState((prev) => ({\n        ...prev,\n        carpetas: res.data ?? [],\n      }));\n    }\n  };'
    },
    {
      target: '  useEffect(() => {\n    if (!idEmpresa) return;\n    const init = async () => {\n      setLoading(true);\n      const [tiposRes, carpetasRes] = await Promise.all([\n        getTiposArchivo(token),\n        getCarpetasEmpresa(idEmpresa, token),\n      ]);\n      if (tiposRes?.isSuccess) setTiposArchivo(tiposRes.data ?? []);\n      if (carpetasRes?.isSuccess) setCarpetas(carpetasRes.data ?? []);\n      setLoading(false);\n    };\n    init();\n  }, [idEmpresa, token]);',
      replacement: '  useEffect(() => {\n    if (!idEmpresa) return;\n    const init = async () => {\n      setState((prev) => ({ ...prev, loading: true }));\n      const [tiposRes, carpetasRes] = await Promise.all([\n        getTiposArchivo(token),\n        getCarpetasEmpresa(idEmpresa, token),\n      ]);\n      setState({\n        tiposArchivo: tiposRes?.isSuccess ? (tiposRes.data ?? []) : [],\n        carpetas: carpetasRes?.isSuccess ? (carpetasRes.data ?? []) : [],\n        loading: false,\n      });\n    };\n    init();\n  }, [idEmpresa, token]);'
    }
  ]
);

// 9. app/admin/archivos-candidato/page.tsx
fixFile(
  path.join(srcDir, 'app/admin/archivos-candidato/page.tsx'),
  [
    {
      target: '  // Loading\n  const [loadingCandidatos, setLoadingCandidatos] = useState(false);\n  const [loadingCarpetas, setLoadingCarpetas] = useState(false);\n  const [loadingArchivos, setLoadingArchivos] = useState(false);',
      replacement: '  // Loading\n  const [loadingState, setLoadingState] = useState({\n    loadingCandidatos: false,\n    loadingCarpetas: false,\n    loadingArchivos: false,\n  });\n  const { loadingCandidatos, loadingCarpetas, loadingArchivos } = loadingState;'
    },
    {
      target: '    const load = async () => {\n      setLoadingCandidatos(true);\n      const [candRes, tiposRes] = await Promise.all([\n        getAdminCandidatos({ pageSize: 200, currentPage: 1 }, token),\n        getTiposArchivo(token),\n      ]);\n      if (candRes?.isSuccess && candRes.data) {\n        setCandidatos(candRes.data.data);\n      }\n      if (tiposRes?.isSuccess && tiposRes.data) {\n        setTiposArchivo(tiposRes.data);\n      }\n      setLoadingCandidatos(false);\n    };',
      replacement: '    const load = async () => {\n      setLoadingState((prev) => ({ ...prev, loadingCandidatos: true }));\n      const [candRes, tiposRes] = await Promise.all([\n        getAdminCandidatos({ pageSize: 200, currentPage: 1 }, token),\n        getTiposArchivo(token),\n      ]);\n      if (candRes?.isSuccess && candRes.data) {\n        setCandidatos(candRes.data.data);\n      }\n      if (tiposRes?.isSuccess && tiposRes.data) {\n        setTiposArchivo(tiposRes.data);\n      }\n      setLoadingState((prev) => ({ ...prev, loadingCandidatos: false }));\n    };'
    },
    {
      target: '    const load = async () => {\n      setLoadingCarpetas(true);\n      setLoadingArchivos(true);\n      setCarpetas([]);\n      setArchivos([]);\n      setSelectedCarpetaId(NO_FOLDER);\n\n      const [carpRes, archRes] = await Promise.all([\n        getCarpetasUsuario(selectedCandidatoId, token),\n        getArchivosUsuario(selectedCandidatoId, null, token),\n      ]);\n      if (carpRes?.isSuccess && carpRes.data) {\n        setCarpetas(carpRes.data);\n      }\n      if (archRes?.isSuccess && archRes.data) {\n        setArchivos(archRes.data);\n      }\n      setLoadingCarpetas(false);\n      setLoadingArchivos(false);\n    };',
      replacement: '    const load = async () => {\n      setLoadingState({\n        loadingCandidatos: false,\n        loadingCarpetas: true,\n        loadingArchivos: true,\n      });\n      setCarpetas([]);\n      setArchivos([]);\n      setSelectedCarpetaId(NO_FOLDER);\n\n      const [carpRes, archRes] = await Promise.all([\n        getCarpetasUsuario(selectedCandidatoId, token),\n        getArchivosUsuario(selectedCandidatoId, null, token),\n      ]);\n      setCarpetas(carpRes?.isSuccess && carpRes.data ? carpRes.data : []);\n      setArchivos(archRes?.isSuccess && archRes.data ? archRes.data : []);\n      setLoadingState({\n        loadingCandidatos: false,\n        loadingCarpetas: false,\n        loadingArchivos: false,\n      });\n    };'
    }
  ]
);

// 10. app/admin/empresas/page.tsx
fixFile(
  path.join(srcDir, 'app/admin/empresas/page.tsx'),
  [
    {
      target: '  const [empresas, setEmpresas] = useState<AdminEmpresa[]>([]);\n  const [loading, setLoading] = useState(true);\n  const [totalItems, setTotalItems] = useState(0);',
      replacement: '  const [state, setState] = useState({\n    empresas: [] as AdminEmpresa[],\n    loading: true,\n    totalItems: 0,\n  });\n  const { empresas, loading, totalItems } = state;'
    },
    {
      target: '    const fetchEmpresas = async () => {\n      setLoading(true);\n      const response = await getAdminEmpresas(',
      replacement: '    const fetchEmpresas = async () => {\n      setState((prev) => ({ ...prev, loading: true }));\n      const response = await getAdminEmpresas('
    },
    {
      target: '      if (response?.isSuccess) {\n        setEmpresas(response.data.data);\n        setTotalItems(response.data.totalItems);\n      }\n      setLoading(false);\n    };',
      replacement: '      if (response?.isSuccess) {\n        setState({\n          empresas: response.data.data,\n          totalItems: response.data.totalItems,\n          loading: false,\n        });\n      } else {\n        setState((prev) => ({ ...prev, loading: false }));\n      }\n    };'
    },
    {
      target: '    setEmpresas((prev) => prev.filter((e) => e.idEmpresa !== idEmpresa));',
      replacement: '    setState((prev) => ({\n      ...prev,\n      empresas: prev.empresas.filter((e) => e.idEmpresa !== idEmpresa),\n    }));'
    }
  ]
);

// 11. useJobs.tsx
fixFile(
  path.join(srcDir, 'app/empleos-busqueda/hooks/useJobs.tsx'),
  [
    {
      target: '  const [jobsData, setJobsData] = useState<GetAllJobsResponse["data"] | null>(\n    null\n  );\n  const [loading, setLoading] = useState(true);',
      replacement: '  const [state, setState] = useState({\n    jobsData: null as GetAllJobsResponse["data"] | null,\n    loading: true,\n  });\n  const { jobsData, loading } = state;'
    },
    {
      target: '    async function load() {\n      setLoading(true);',
      replacement: '    async function load() {\n      setState((prev) => ({ ...prev, loading: true }));'
    },
    {
      target: '        if (data?.isSuccess && data.data) {\n          setJobsData(data.data);\n        }\n      } catch (e: unknown) {\n        if (e instanceof Error && e.name !== "AbortError") console.warn(e);\n      } finally {\n        setLoading(false);\n      }',
      replacement: '        if (data?.isSuccess && data.data) {\n          setState({\n            jobsData: data.data,\n            loading: false,\n          });\n        } else {\n          setState((prev) => ({ ...prev, loading: false }));\n        }\n      } catch (e: unknown) {\n        if (e instanceof Error && e.name !== "AbortError") console.warn(e);\n        setState((prev) => ({ ...prev, loading: false }));\n      }'
    }
  ]
);

// 12. app/admin/empleos/page.tsx
fixFile(
  path.join(srcDir, 'app/admin/empleos/page.tsx'),
  [
    {
      target: '  // Fetch empleos from real API\n  useEffect(() => {\n    const fetchEmpleos = async () => {\n      setData(prev => ({ ...prev, loading: true }));\n      const response = await getAdminEmpleos(\n        {\n          pageSize,\n          currentPage,\n          searchQuery: search,\n          idEstado: parseInt(estadoFilter, 10),\n        },\n        session?.user?.accessToken,\n      );\n      if (response?.isSuccess) {\n        setData({\n          empleos: response.data.data,\n          totalItems: response.data.totalItems,\n          loading: false,\n        });\n      } else {\n        setData(prev => ({ ...prev, loading: false }));\n      }\n    };',
      replacement: '  // Fetch empleos from real API\n  useEffect(() => {\n    const fetchEmpleos = async () => {\n      const response = await getAdminEmpleos(\n        {\n          pageSize,\n          currentPage,\n          searchQuery: search,\n          idEstado: parseInt(estadoFilter, 10),\n        },\n        session?.user?.accessToken,\n      );\n      if (response?.isSuccess) {\n        setData({\n          empleos: response.data.data,\n          totalItems: response.data.totalItems,\n          loading: false,\n        });\n      } else {\n        setData({\n          empleos: [],\n          totalItems: 0,\n          loading: false,\n        });\n      }\n    };'
    }
  ]
);

// 13. AdminTestimoniosClient.tsx
fixFile(
  path.join(srcDir, 'app/admin/testimonios/components/AdminTestimoniosClient.tsx'),
  [
    {
      target: '  const [testimonios, setTestimonios] = useState<TestimonialData[]>([]);\n  const [loading, setLoading] = useState(true);\n  const [totalItems, setTotalItems] = useState(0);',
      replacement: '  const [state, setState] = useState({\n    testimonios: [] as TestimonialData[],\n    loading: true,\n    totalItems: 0,\n  });\n  const { testimonios, loading, totalItems } = state;'
    },
    {
      target: '    const fetchData = async () => {\n      setLoading(true);',
      replacement: '    const fetchData = async () => {\n      setState((prev) => ({ ...prev, loading: true }));'
    },
    {
      target: '        if (response) {\n          setTestimonios(response.data.data);\n          setTotalItems(response.data.totalItems);\n        }\n      } catch (error) {\n        console.error("Error fetching testimonials:", error);\n      } finally {\n        setLoading(false);\n      }',
      replacement: '        if (response) {\n          setState({\n            testimonios: response.data.data,\n            totalItems: response.data.totalItems,\n            loading: false,\n          });\n        } else {\n          setState((prev) => ({ ...prev, loading: false }));\n        }\n      } catch (error) {\n        console.error("Error fetching testimonials:", error);\n        setState((prev) => ({ ...prev, loading: false }));\n      }'
    }
  ]
);

// 14. app/admin/roles/page.tsx
fixFile(
  path.join(srcDir, 'app/admin/roles/page.tsx'),
  [
    {
      target: '  const [roles, setRoles] = useState<AdminRole[]>([]);\n  const [loading, setLoading] = useState(true);',
      replacement: '  const [state, setState] = useState({\n    roles: [] as AdminRole[],\n    loading: true,\n  });\n  const { roles, loading } = state;'
    },
    {
      target: '    const fetchRoles = async () => {\n      setLoading(true);\n      await new Promise<void>((resolve) => {\n        timerId = setTimeout(resolve, 500);\n      });\n      if (cancelled) return;\n      setRoles(mockRoles);\n      setLoading(false);\n    };',
      replacement: '    const fetchRoles = async () => {\n      setState((prev) => ({ ...prev, loading: true }));\n      await new Promise<void>((resolve) => {\n        timerId = setTimeout(resolve, 500);\n      });\n      if (cancelled) return;\n      setState({\n        roles: mockRoles,\n        loading: false,\n      });\n    };'
    },
    {
      target: '    setRoles((prev) =>\n      prev.map((r) =>',
      replacement: '    setState((prev) => ({\n      ...prev,\n      roles: prev.roles.map((r) =>'
    },
    {
      target: '      setRoles((prev) => [newRole, ...prev]);',
      replacement: '      setState((prev) => ({\n        ...prev,\n        roles: [newRole, ...prev.roles],\n      }));'
    },
    {
      target: '    setRoles((prev) => prev.filter((r) => r.idRol !== idRol));',
      replacement: '    setState((prev) => ({\n      ...prev,\n      roles: prev.roles.filter((r) => r.idRol !== idRol),\n    }));'
    }
  ]
);

// 15. app/perfil/recomendaciones/page.tsx
fixFile(
  path.join(srcDir, 'app/perfil/recomendaciones/page.tsx'),
  [
    {
      target: '  const [recomendaciones, setRecomendaciones] = useState<RecomendacionItem[]>(\n    [],\n  );\n  const [loading, setLoading] = useState(true);',
      replacement: '  const [state, setState] = useState({\n    recomendaciones: [] as RecomendacionItem[],\n    loading: true,\n  });\n  const { recomendaciones, loading } = state;'
    },
    {
      target: '    const fetchData = async () => {\n      setLoading(true);\n      try {\n        const response = await fetchApi<\n          GenericResponse<PaginatedRecomendaciones>\n        >(`/Recomendaciones/getByUsuario/${userId}`, {\n          method: "POST",\n          token: session.user.accessToken,\n          body: { pageSize: 100, currentPage: 1 },\n        });\n\n        if (response?.isSuccess && response.data?.data) {\n          setRecomendaciones(response.data.data);\n        }\n      } finally {\n        setLoading(false);\n      }\n    };',
      replacement: '    const fetchData = async () => {\n      setState((prev) => ({ ...prev, loading: true }));\n      try {\n        const response = await fetchApi<\n          GenericResponse<PaginatedRecomendaciones>\n        >(`/Recomendaciones/getByUsuario/${userId}`, {\n          method: "POST",\n          token: session.user.accessToken,\n          body: { pageSize: 100, currentPage: 1 },\n        });\n\n        if (response?.isSuccess && response.data?.data) {\n          setState({\n            recomendaciones: response.data.data,\n            loading: false,\n          });\n        } else {\n          setState((prev) => ({ ...prev, loading: false }));\n        }\n      } catch (err) {\n        setState((prev) => ({ ...prev, loading: false }));\n      }\n    };'
    }
  ]
);

// 16. PostulacionesList.tsx
fixFile(
  path.join(srcDir, 'app/empresa-perfil/postulaciones/PostulacionesList.tsx'),
  [
    {
      target: '  const [postulaciones, setPostulaciones] = useState<AplicacionItem[]>([]);\n  const [loading, setLoading] = useState(true);\n  const [totalItems, setTotalItems] = useState(0);',
      replacement: '  const [state, setState] = useState({\n    postulaciones: [] as AplicacionItem[],\n    loading: true,\n    totalItems: 0,\n  });\n  const { postulaciones, loading, totalItems } = state;'
    },
    {
      target: '    const fetchPostulaciones = async () => {\n      if (!session?.user?.idEmpresa || !session?.user?.accessToken) return;\n      setLoading(true);',
      replacement: '    const fetchPostulaciones = async () => {\n      if (!session?.user?.idEmpresa || !session?.user?.accessToken) return;\n      setState((prev) => ({ ...prev, loading: true }));'
    },
    {
      target: '        if (data) {\n          setPostulaciones(data.data);\n          setTotalItems(data.totalItems);\n        }\n      } catch (error) {\n        console.error("Error fetching postulaciones:", error);\n      } finally {\n        setLoading(false);\n      }',
      replacement: '        if (data) {\n          setState({\n            postulaciones: data.data,\n            totalItems: data.totalItems,\n            loading: false,\n          });\n        } else {\n          setState((prev) => ({ ...prev, loading: false }));\n        }\n      } catch (error) {\n        console.error("Error fetching postulaciones:", error);\n        setState((prev) => ({ ...prev, loading: false }));\n      }'
    }
  ]
);

// 17. app/perfil/archivos/page.tsx
fixFile(
  path.join(srcDir, 'app/perfil/archivos/page.tsx'),
  [
    {
      target: '  const [tiposArchivo, setTiposArchivo] = useState<TipoArchivo[]>([]);\n  const [carpetas, setCarpetas] = useState<CarpetaUsuario[]>([]);\n  const [loading, setLoading] = useState(true);',
      replacement: '  const [state, setState] = useState({\n    tiposArchivo: [] as TipoArchivo[],\n    carpetas: [] as CarpetaUsuario[],\n    loading: true,\n  });\n  const { tiposArchivo, carpetas, loading } = state;'
    },
    {
      target: '  const loadCarpetas = async () => {\n    if (!idUsuario) return;\n    const res = await getCarpetasUsuario(idUsuario, token);\n    if (res?.isSuccess) setCarpetas(res.data ?? []);\n  };',
      replacement: '  const loadCarpetas = async () => {\n    if (!idUsuario) return;\n    const res = await getCarpetasUsuario(idUsuario, token);\n    if (res?.isSuccess) {\n      setState((prev) => ({\n        ...prev,\n        carpetas: res.data ?? [],\n      }));\n    }\n  };'
    },
    {
      target: '  useEffect(() => {\n    if (!idUsuario) return;\n    const init = async () => {\n      setLoading(true);\n      const [tiposRes, carpetasRes] = await Promise.all([\n        getTiposArchivo(token),\n        getCarpetasUsuario(idUsuario, token),\n      ]);\n      if (tiposRes?.isSuccess) setTiposArchivo(tiposRes.data ?? []);\n      if (carpetasRes?.isSuccess) setCarpetas(carpetasRes.data ?? []);\n      setLoading(false);\n    };\n    init();\n  }, [idUsuario, token]);',
      replacement: '  useEffect(() => {\n    if (!idUsuario) return;\n    const init = async () => {\n      setState((prev) => ({ ...prev, loading: true }));\n      const [tiposRes, carpetasRes] = await Promise.all([\n        getTiposArchivo(token),\n        getCarpetasUsuario(idUsuario, token),\n      ]);\n      setState({\n        tiposArchivo: tiposRes?.isSuccess ? (tiposRes.data ?? []) : [],\n        carpetas: carpetasRes?.isSuccess ? (carpetasRes.data ?? []) : [],\n        loading: false,\n      });\n    };\n    init();\n  }, [idUsuario, token]);'
    }
  ]
);

// 18. app/empresa-perfil/empleos/page.tsx
fixFile(
  path.join(srcDir, 'app/empresa-perfil/empleos/page.tsx'),
  [
    {
      target: '  const [ofertas, setOfertas] = useState<OfertaEmpleo[]>([]);\n  const [currentPage, setCurrentPage] = useState(1);\n  const [totalItems, setTotalItems] = useState(0);\n  const [loading, setLoading] = useState(true);',
      replacement: '  const [state, setState] = useState({\n    ofertas: [] as OfertaEmpleo[],\n    totalItems: 0,\n    loading: true,\n  });\n  const { ofertas, totalItems, loading } = state;\n  const [currentPage, setCurrentPage] = useState(1);'
    },
    {
      target: '    async function cargarOfertas() {\n      if (!session) return;\n      setLoading(true);',
      replacement: '    async function cargarOfertas() {\n      if (!session) return;\n      setState((prev) => ({ ...prev, loading: true }));'
    },
    {
      target: '      if (resultado) {\n        setOfertas(resultado.data);\n        setTotalItems(resultado.totalItems);\n      } else {\n        setOfertas([]);\n        setTotalItems(0);\n      }\n      setLoading(false);',
      replacement: '      if (resultado) {\n        setState({\n          ofertas: resultado.data,\n          totalItems: resultado.totalItems,\n          loading: false,\n        });\n      } else {\n        setState({\n          ofertas: [],\n          totalItems: 0,\n          loading: false,\n        });\n      }'
    }
  ]
);

// 19. BannerSelector.tsx
fixFile(
  path.join(srcDir, 'app/empresa-perfil/crear-empleo/BannerSelector.tsx'),
  [
    {
      target: '  const [archivos, setArchivos] = useState<ArchivoEmpresa[]>([]);\n  const [selectedId, setSelectedId] = useState<string | null>(\n    selectedArchivos || null\n  );\n  const [selectedBanner, setSelectedBanner] = useState<string | null>(null);\n  const [loading, setLoading] = useState(false);',
      replacement: '  const [state, setState] = useState({\n    archivos: [] as ArchivoEmpresa[],\n    loading: false,\n  });\n  const { archivos, loading } = state;\n  const [selectedId, setSelectedId] = useState<string | null>(\n    selectedArchivos || null\n  );\n  const [selectedBanner, setSelectedBanner] = useState<string | null>(null);'
    },
    {
      target: '    const fetchArchivos = async () => {\n      if (!idEmpresa || !session?.user?.accessToken) return;\n      setLoading(true);',
      replacement: '    const fetchArchivos = async () => {\n      if (!idEmpresa || !session?.user?.accessToken) return;\n      setState((prev) => ({ ...prev, loading: true }));'
    },
    {
      target: '      if (response?.isSuccess && response.data) {\n        // Filtrar solo imágenes (banners)\n        const imagenes = response.data.filter(\n          (a) =>\n            a.contentType?.startsWith("image/") ||\n            a.extension?.match(/\\.(jpg|jpeg|png|gif|webp)$/i)\n        );\n        setArchivos(imagenes);\n      }\n      setLoading(false);',
      replacement: '      if (response?.isSuccess && response.data) {\n        // Filtrar solo imágenes (banners)\n        const imagenes = response.data.filter(\n          (a) =>\n            a.contentType?.startsWith("image/") ||\n            a.extension?.match(/\\.(jpg|jpeg|png|gif|webp)$/i)\n        );\n        setState({\n          archivos: imagenes,\n          loading: false,\n        });\n      } else {\n        setState((prev) => ({ ...prev, loading: false }));\n      }'
    }
  ]
);

console.log("Refactoring complete!");

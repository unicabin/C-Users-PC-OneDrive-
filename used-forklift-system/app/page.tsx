"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Container } from "@/components/ui/container";
import { ConsultSection } from "@/components/used-forklift/consult-section";
import { CustomerSection } from "@/components/used-forklift/customer-section";
import { DashboardOverview } from "@/components/used-forklift/dashboard-overview";
import { InventorySection } from "@/components/used-forklift/inventory-section";
import { KpiCards } from "@/components/used-forklift/kpi-cards";
import { ShipmentSection } from "@/components/used-forklift/shipment-section";
import { getAuthBrowserClient } from "@/lib/auth";
import { canAccessTab, roleLabel } from "@/lib/authz";
import { buildInventoryImportPreviewFromFile, downloadAllDataExcel, downloadForkliftsExcel } from "@/lib/used-forklift-excel";
import { createAsRequest, listAsRequests } from "@/lib/repositories/as-requests";
import { createConsultation, listConsultations, removeConsultation, updateConsultation } from "@/lib/repositories/consultations";
import { createCustomer, listCustomers, removeCustomer } from "@/lib/repositories/customers";
import { createForklift, listForklifts, removeForklift, updateForklift } from "@/lib/repositories/forklifts";
import { ensureProfileForUser } from "@/lib/repositories/profiles";
import { seedAllTablesIfEmpty } from "@/lib/repositories/seed";
import { createShipment, listShipments, updateShipment } from "@/lib/repositories/shipments";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  buildKpiCards,
  buildRecentConsultations,
  buildRecentShipments,
  createShipmentId,
  emptyConsultationForm,
  emptyCustomerForm,
  emptyForkliftForm,
  emptyShipmentForm,
  TAB_ITEMS,
} from "@/lib/used-forklift-utils";
import { Consultation, Customer, Forklift, InventoryImportPreview, Shipment, TabKey, UserProfile } from "@/types/used-forklift";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "작업 중 오류가 발생했습니다.";
}

export default function UsedForkliftManagementPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("inventory");
  const [inventoryImportPreview, setInventoryImportPreview] = useState<InventoryImportPreview | null>(null);

  const [forklifts, setForklifts] = useState<Forklift[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [asList, setAsList] = useState<{ id: string; forkliftId: string; createdAt?: string; organizationId?: string }[]>([]);

  const [forkliftForm, setForkliftForm] = useState<Forklift>(emptyForkliftForm);
  const [customerForm, setCustomerForm] = useState<Customer>(emptyCustomerForm);
  const [consultationForm, setConsultationForm] = useState<Consultation>(emptyConsultationForm);
  const [shipmentForm, setShipmentForm] = useState<Shipment>(emptyShipmentForm);

  const [customerSearch, setCustomerSearch] = useState("");
  const [customerStatusFilter, setCustomerStatusFilter] = useState("전체");
  const [consultSearch, setConsultSearch] = useState("");
  const [consultStatusFilter, setConsultStatusFilter] = useState("전체");
  const [shipmentSearch, setShipmentSearch] = useState("");
  const [shipmentStatusFilter, setShipmentStatusFilter] = useState("전체");
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState("전체");
  const [customerRegionFilter, setCustomerRegionFilter] = useState("전체");
  const [consultQuickPendingOnly, setConsultQuickPendingOnly] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const supabaseReady = isSupabaseConfigured();
  const isAdmin = userProfile?.role === "admin";
  const availableTabs = useMemo(
    () => TAB_ITEMS.filter((tab) => canAccessTab(userProfile?.role, tab.key)),
    [userProfile?.role],
  );

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [forkliftsData, customersData, consultationsData, shipmentsData, asListData] =
        await Promise.all([
          listForklifts(),
          listCustomers(),
          listConsultations(),
          listShipments(),
          listAsRequests(),
        ]);

      setForklifts(forkliftsData);
      setCustomers(customersData);
      setConsultations(consultationsData);
      setShipments(shipmentsData);
      setAsList(asListData);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAllData();
  }, [loadAllData]);

  useEffect(() => {
    const supabase = getAuthBrowserClient();
    if (!supabase) {
      return;
    }

    void supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user ?? null;
      setAuthUser(user);
      if (user) {
        const profile = await ensureProfileForUser(user);
        setUserProfile(profile);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      setAuthUser(user);
      if (user) {
        const profile = await ensureProfileForUser(user);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (userProfile?.role && !canAccessTab(userProfile.role, activeTab)) {
      setActiveTab("inventory");
    }
  }, [activeTab, userProfile?.role]);

  const kpiCards = useMemo(
    () => buildKpiCards({ forklifts, shipments, consultations, asList }),
    [asList, consultations, forklifts, shipments],
  );

  const filteredCustomers = useMemo(() => {
    return customers.filter((item) => {
      const matchesSearch =
        !customerSearch ||
        item.name.includes(customerSearch) ||
        item.company.includes(customerSearch) ||
        item.phone.includes(customerSearch);
      const matchesStatus = customerStatusFilter === "전체" || item.status === customerStatusFilter;
      const matchesRegion = customerRegionFilter === "전체" || item.region === customerRegionFilter;
      return matchesSearch && matchesStatus && matchesRegion;
    });
  }, [customerRegionFilter, customerSearch, customerStatusFilter, customers]);

  const customerRegions = useMemo(
    () => [...new Set(customers.map((item) => item.region).filter(Boolean))],
    [customers],
  );

  const filteredForklifts = useMemo(() => {
    return forklifts.filter((item) => {
      const matchesSearch =
        !inventorySearch ||
        item.id.includes(inventorySearch) ||
        item.vehicleNumber.includes(inventorySearch) ||
        item.model.includes(inventorySearch);
      const matchesStatus = inventoryStatusFilter === "전체" || item.status === inventoryStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [forklifts, inventorySearch, inventoryStatusFilter]);

  const filteredConsultations = useMemo(() => {
    return consultations.filter((item) => {
      const matchesSearch =
        !consultSearch ||
        item.customerName.includes(consultSearch) ||
        item.phone.includes(consultSearch) ||
        item.company.includes(consultSearch) ||
        item.model.includes(consultSearch);
      const matchesStatus = consultStatusFilter === "전체" || item.status === consultStatusFilter;
      const matchesQuickFilter = !consultQuickPendingOnly || item.status === "계약예정";
      return matchesSearch && matchesStatus && matchesQuickFilter;
    });
  }, [consultQuickPendingOnly, consultSearch, consultStatusFilter, consultations]);

  const filteredShipments = useMemo(() => {
    return [...shipments]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter((item) => {
        const matchesSearch =
          !shipmentSearch ||
          item.id.includes(shipmentSearch) ||
          item.vehicleNumber.includes(shipmentSearch) ||
          item.customerName.includes(shipmentSearch);
        const matchesStatus = shipmentStatusFilter === "전체" || item.status === shipmentStatusFilter;
        return matchesSearch && matchesStatus;
      });
  }, [shipmentSearch, shipmentStatusFilter, shipments]);

  const recentConsultations = useMemo(() => buildRecentConsultations(consultations), [consultations]);
  const recentShipments = useMemo(() => buildRecentShipments(shipments), [shipments]);

  const isDatabaseEmpty =
    !isLoading &&
    forklifts.length === 0 &&
    customers.length === 0 &&
    consultations.length === 0 &&
    shipments.length === 0 &&
    asList.length === 0;

  useEffect(() => {
    const selectedForklift = forklifts.find((item) => item.id === shipmentForm.forkliftId);
    if (!selectedForklift) {
      return;
    }

    setShipmentForm((current) =>
      current.vehicleNumber === selectedForklift.vehicleNumber
        ? current
        : { ...current, vehicleNumber: selectedForklift.vehicleNumber },
    );
  }, [forklifts, shipmentForm.forkliftId]);

  useEffect(() => {
    const selectedForklift = forklifts.find((item) => item.id === consultationForm.forkliftId);
    if (!selectedForklift) {
      return;
    }

    setConsultationForm((current) =>
      current.model === selectedForklift.model
        ? current
        : { ...current, model: selectedForklift.model },
    );
  }, [consultationForm.forkliftId, forklifts]);

  function handleForkliftFormChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setForkliftForm((current) => ({ ...current, [name]: value }));
  }

  function handleCustomerFormChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setCustomerForm((current) => ({ ...current, [name]: value }));
  }

  function handleConsultationFormChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;

    if (name === "customerId") {
      const selectedCustomer = customers.find((item) => item.id === value);
      setConsultationForm((current) => ({
        ...current,
        customerId: value,
        customerName: selectedCustomer?.name ?? current.customerName,
        phone: selectedCustomer?.phone ?? current.phone,
        company: selectedCustomer?.company ?? current.company,
      }));
      return;
    }

    setConsultationForm((current) => ({ ...current, [name]: value }));
  }

  function handleShipmentFormChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;

    if (name === "customerId") {
      const selectedCustomer = customers.find((item) => item.id === value);
      setShipmentForm((current) => ({
        ...current,
        customerId: value,
        customerName: selectedCustomer?.name ?? current.customerName,
      }));
      return;
    }

    setShipmentForm((current) => ({ ...current, [name]: value }));
  }

  async function handleAddForklift(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!forkliftForm.id || !forkliftForm.vehicleNumber || !forkliftForm.model) {
      alert("재고번호, 차량번호, 모델명은 필수입니다.");
      return;
    }
    if (forklifts.some((item) => item.id === forkliftForm.id)) {
      alert("중복된 재고번호입니다.");
      return;
    }

    try {
      const created = await createForklift({
        ...forkliftForm,
        organizationId: userProfile?.organizationId,
        createdAt: new Date().toISOString(),
      });
      setForklifts((current) => [created, ...current]);
      setForkliftForm(emptyForkliftForm);
    } catch (mutationError) {
      alert(getErrorMessage(mutationError));
    }
  }

  async function handleAddCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!customerForm.id || !customerForm.name || !customerForm.phone) {
      alert("고객번호, 고객명, 연락처는 필수입니다.");
      return;
    }
    if (customers.some((item) => item.id === customerForm.id)) {
      alert("중복된 고객번호입니다.");
      return;
    }

    try {
      const created = await createCustomer({
        ...customerForm,
        organizationId: userProfile?.organizationId,
        createdAt: new Date().toISOString(),
      });
      setCustomers((current) => [created, ...current]);
      setCustomerForm(emptyCustomerForm);
    } catch (mutationError) {
      alert(getErrorMessage(mutationError));
    }
  }

  async function handleAddConsultation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consultationForm.id || !consultationForm.customerName || !consultationForm.phone) {
      alert("상담번호, 고객명, 연락처는 필수입니다.");
      return;
    }
    if (consultations.some((item) => item.id === consultationForm.id)) {
      alert("중복된 상담번호입니다.");
      return;
    }

    try {
      const created = await createConsultation({
        ...consultationForm,
        organizationId: userProfile?.organizationId,
        convertedToShipment: consultationForm.convertedToShipment ?? false,
        createdAt: new Date().toISOString(),
      });
      setConsultations((current) => [created, ...current]);
      setConsultationForm(emptyConsultationForm);
    } catch (mutationError) {
      alert(getErrorMessage(mutationError));
    }
  }

  async function handleAddShipment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!shipmentForm.id || !shipmentForm.forkliftId || !shipmentForm.customerName) {
      alert("출고번호, 차량번호, 고객명은 필수입니다.");
      return;
    }

    const selectedForklift = forklifts.find((item) => item.id === shipmentForm.forkliftId);
    if (!selectedForklift) {
      alert("연결할 재고를 먼저 선택해주세요.");
      return;
    }
    if (selectedForklift.status === "판매완료") {
      alert("이미 판매완료 처리된 차량입니다.");
      return;
    }

    try {
      const shipmentToCreate: Shipment = {
        ...shipmentForm,
        vehicleNumber: selectedForklift.vehicleNumber,
        status: "준비중",
        organizationId: userProfile?.organizationId,
        createdAt: new Date().toISOString(),
      };

      const createdShipment = await createShipment(shipmentToCreate);
      const updatedForklift = await updateForklift(shipmentForm.forkliftId, { status: "판매완료" });

      setShipments((current) => [createdShipment, ...current]);
      if (updatedForklift) {
        setForklifts((current) => current.map((item) => (item.id === updatedForklift.id ? updatedForklift : item)));
      }
      setShipmentForm(emptyShipmentForm);
      setActiveTab("shipment");
    } catch (mutationError) {
      alert(getErrorMessage(mutationError));
    }
  }

  async function handleShipmentStatusChange(shipmentId: string) {
    const target = shipments.find((item) => item.id === shipmentId);
    if (!target) {
      return;
    }

    const nextStatus =
      target.status === "준비중"
        ? "출고완료"
        : target.status === "출고완료"
          ? "인도완료"
          : null;

    if (!nextStatus) {
      return;
    }

    try {
      const updated = await updateShipment(shipmentId, { status: nextStatus });
      if (!updated) {
        return;
      }
      setShipments((current) => current.map((item) => (item.id === shipmentId ? updated : item)));
    } catch (mutationError) {
      alert(getErrorMessage(mutationError));
    }
  }

  async function handleConsultToShipment(consultation: Consultation) {
    if (!["계약예정", "종료"].includes(consultation.status)) {
      return;
    }
    if (consultation.convertedToShipment) {
      alert("이미 출고 전환된 상담입니다.");
      return;
    }

    const selectedForklift = forklifts.find((item) => item.id === consultation.forkliftId);
    if (selectedForklift?.status === "판매완료") {
      alert("이미 판매완료 상태인 차량이라 출고 전환할 수 없습니다.");
      return;
    }

    try {
      const updated = await updateConsultation(consultation.id, { convertedToShipment: true });
      if (updated) {
        setConsultations((current) => current.map((item) => (item.id === consultation.id ? updated : item)));
      }

      setShipmentForm({
        id: createShipmentId(),
        forkliftId: consultation.forkliftId,
        vehicleNumber: selectedForklift?.vehicleNumber ?? "",
        customerId: consultation.customerId,
        customerName: consultation.customerName,
        shipmentDate: new Date().toISOString().slice(0, 10),
        transportMethod: "",
        manager: "",
        note: consultation.note,
        status: "준비중",
        createdAt: "",
        consultationId: consultation.id,
        organizationId: userProfile?.organizationId,
      });
      setActiveTab("shipment");
    } catch (mutationError) {
      alert(getErrorMessage(mutationError));
    }
  }

  async function handleExcelUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const preview = await buildInventoryImportPreviewFromFile(file);
      if (!preview) {
        alert("가져올 수 있는 재고 데이터가 없습니다.");
        return;
      }
      setInventoryImportPreview(preview);
    } catch {
      alert("엑셀 파일을 읽는 중 오류가 발생했습니다.");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function applyInventoryImportPreview() {
    if (!inventoryImportPreview) {
      return;
    }

    try {
      const existingIds = new Set(forklifts.map((item) => item.id));
      const dedupedImports = inventoryImportPreview.forklifts.filter((item) => !existingIds.has(item.id));

      const createdForklifts = await Promise.all(
        dedupedImports.map((item) =>
          createForklift({
            ...item,
            organizationId: userProfile?.organizationId,
            createdAt: new Date().toISOString(),
          }),
        ),
      );

      const existingAsKeys = new Set(asList.map((item) => `${item.id}-${item.forkliftId}`));
      const dedupedRequests = inventoryImportPreview.asRequests.filter(
        (item) => !existingAsKeys.has(`${item.id}-${item.forkliftId}`),
      );

      const createdAsRequests = await Promise.all(
        dedupedRequests.map((item) =>
          createAsRequest({
            ...item,
            organizationId: userProfile?.organizationId,
            createdAt: new Date().toISOString(),
          }),
        ),
      );

      setForklifts((current) => [...createdForklifts, ...current]);
      setAsList((current) => [...createdAsRequests, ...current]);

      alert(
        `${inventoryImportPreview.sheetName} 시트에서 ${inventoryImportPreview.forklifts.length}건을 읽었고 ${createdForklifts.length}건을 재고로 추가했습니다. 판매 시트 ${inventoryImportPreview.soldForkliftIds.length}건, 수리내역 ${createdAsRequests.length}건도 함께 반영했습니다.`,
      );
      setInventoryImportPreview(null);
    } catch (mutationError) {
      alert(getErrorMessage(mutationError));
    }
  }

  async function handleSeedData() {
    if (!isAdmin) {
      alert("샘플 데이터 입력은 관리자만 가능합니다.");
      return;
    }

    setIsSeeding(true);
    try {
      const result = await seedAllTablesIfEmpty();
      await loadAllData();

      if (!result.forkliftsSeeded && !result.customersSeeded && !result.consultationsSeeded && !result.shipmentsSeeded && !result.asSeeded) {
        alert("이미 데이터가 있어서 샘플 데이터는 넣지 않았습니다.");
        return;
      }

      alert("샘플 데이터를 초기 테이블에 입력했습니다.");
    } catch (seedError) {
      alert(getErrorMessage(seedError));
    } finally {
      setIsSeeding(false);
    }
  }

  async function handleLogout() {
    const supabase = getAuthBrowserClient();
    if (!supabase) {
      window.location.href = "/login";
      return;
    }

    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (isLoading) {
    return (
      <div className="py-14 sm:py-16">
        <Container>
          <section className="panel px-6 py-20 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue">Used Forklift Management</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">중고지게차 재고/고객/상담/출고 관리</h1>
            <p className="mt-4 text-sm text-slate-500">데이터를 불러오는 중입니다.</p>
          </section>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-14 sm:py-16">
      <Container>
        <section className="panel overflow-hidden">
          <div className="border-b border-line bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.16),transparent_34%),linear-gradient(135deg,#f7fbff_0%,#ffffff_62%,#eef4ff_100%)] px-6 py-8 sm:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue">Used Forklift Management</p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">중고지게차 재고/고객/상담/출고 관리</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                  고객에서 상담으로, 상담에서 출고로 자연스럽게 이어지는 실무형 운영 흐름을 한 화면에서 관리할 수 있도록 구성했습니다.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
                {authUser?.email ? (
                  <div className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-slate-600">
                    {authUser.email}
                  </div>
                ) : null}
                <div className={`rounded-full px-4 py-2 text-sm font-semibold ${isAdmin ? "bg-navy text-white" : "bg-slate-100 text-slate-700"}`}>
                  {roleLabel(userProfile?.role)}
                </div>
                <button type="button" onClick={handleLogout} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue hover:text-blue">
                  로그아웃
                </button>
                {isDatabaseEmpty ? (
                  <button type="button" onClick={handleSeedData} disabled={isSeeding || !isAdmin} className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue disabled:cursor-not-allowed disabled:opacity-60">
                    {isSeeding ? "샘플 데이터 입력 중..." : "샘플 데이터 넣기"}
                  </button>
                ) : null}
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {!supabaseReady ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Supabase 환경변수가 없어 현재는 mock repository 모드로 실행 중입니다. `.env.local`을 설정하면 실제 DB로 바로 전환됩니다.
                </div>
              ) : null}
              {userProfile && !isAdmin ? (
                <div className="rounded-2xl border border-blue/20 bg-blue/5 px-4 py-3 text-sm text-blue">
                  현재 직원 권한으로 로그인되어 있습니다. 고객관리 탭 접근, 삭제, 샘플 데이터 입력은 관리자만 사용할 수 있습니다.
                </div>
              ) : null}
              {userProfile?.organizationId ? (
                <div className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-slate-600">
                  조직 스코프: <span className="font-semibold text-navy">{userProfile.organizationId}</span>
                </div>
              ) : null}
              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  데이터 로딩 오류: {error}
                </div>
              ) : null}
            </div>
          </div>

          <KpiCards items={kpiCards} />
          <DashboardOverview recentConsultations={recentConsultations} recentShipments={recentShipments} />

          <div className="border-b border-line px-4 py-4 sm:px-6">
            <div className="flex flex-wrap gap-3">
              {availableTabs.map((tab) => {
                const active = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                      active ? "bg-navy text-white" : "border border-line bg-white text-slate-600 hover:border-blue hover:text-blue"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-8 px-4 py-6 sm:px-6 sm:py-8">
            {activeTab === "inventory" ? (
              <InventorySection
                forkliftForm={forkliftForm}
                forklifts={forklifts}
                filteredForklifts={filteredForklifts}
                asList={asList}
                canDeleteForklift={isAdmin}
                importPreview={inventoryImportPreview}
                fileInputRef={fileInputRef}
                inventorySearch={inventorySearch}
                inventoryStatusFilter={inventoryStatusFilter}
                onForkliftFormChange={handleForkliftFormChange}
                onAddForklift={handleAddForklift}
                onUploadChange={handleExcelUpload}
                onDownloadExcel={() => downloadForkliftsExcel(forklifts)}
                onDownloadAllExcel={() => downloadAllDataExcel({ forklifts, customers, consultations, shipments, asList })}
                onApplyImportPreview={() => void applyInventoryImportPreview()}
                onCancelImportPreview={() => setInventoryImportPreview(null)}
                onInventorySearchChange={setInventorySearch}
                onInventoryStatusFilterChange={setInventoryStatusFilter}
                onUpdateForkliftStatus={(forkliftId, status) =>
                  void (async () => {
                    try {
                      const updated = await updateForklift(forkliftId, { status });
                      if (!updated) {
                        return;
                      }
                      setForklifts((current) => current.map((item) => (item.id === forkliftId ? updated : item)));
                    } catch (mutationError) {
                      alert(getErrorMessage(mutationError));
                    }
                  })()
                }
                onDeleteForklift={(forkliftId) =>
                  void (async () => {
                    if (!isAdmin) {
                      alert("삭제는 관리자만 가능합니다.");
                      return;
                    }
                    try {
                      await removeForklift(forkliftId);
                      setForklifts((current) => current.filter((item) => item.id !== forkliftId));
                    } catch (mutationError) {
                      alert(getErrorMessage(mutationError));
                    }
                  })()
                }
              />
            ) : null}

            {activeTab === "customer" ? (
              <CustomerSection
                customerForm={customerForm}
                filteredCustomers={filteredCustomers}
                canDeleteCustomer={isAdmin}
                customerSearch={customerSearch}
                customerStatusFilter={customerStatusFilter}
                customerRegionFilter={customerRegionFilter}
                customerRegions={customerRegions}
                onCustomerFormChange={handleCustomerFormChange}
                onCustomerSearchChange={setCustomerSearch}
                onCustomerStatusFilterChange={setCustomerStatusFilter}
                onCustomerRegionFilterChange={setCustomerRegionFilter}
                onAddCustomer={handleAddCustomer}
                onDeleteCustomer={(customerId) =>
                  void (async () => {
                    if (!isAdmin) {
                      alert("삭제는 관리자만 가능합니다.");
                      return;
                    }
                    try {
                      await removeCustomer(customerId);
                      setCustomers((current) => current.filter((item) => item.id !== customerId));
                    } catch (mutationError) {
                      alert(getErrorMessage(mutationError));
                    }
                  })()
                }
              />
            ) : null}

            {activeTab === "consult" ? (
              <ConsultSection
                consultationForm={consultationForm}
                filteredConsultations={filteredConsultations}
                canDeleteConsultation={isAdmin}
                customers={customers}
                forklifts={forklifts}
                consultSearch={consultSearch}
                consultStatusFilter={consultStatusFilter}
                consultQuickPendingOnly={consultQuickPendingOnly}
                onConsultationFormChange={handleConsultationFormChange}
                onConsultSearchChange={setConsultSearch}
                onConsultStatusFilterChange={setConsultStatusFilter}
                onConsultQuickPendingToggle={() => setConsultQuickPendingOnly((current) => !current)}
                onAddConsultation={handleAddConsultation}
                onConsultToShipment={(consultation) => void handleConsultToShipment(consultation)}
                onDeleteConsultation={(consultationId) =>
                  void (async () => {
                    if (!isAdmin) {
                      alert("삭제는 관리자만 가능합니다.");
                      return;
                    }
                    try {
                      await removeConsultation(consultationId);
                      setConsultations((current) => current.filter((item) => item.id !== consultationId));
                    } catch (mutationError) {
                      alert(getErrorMessage(mutationError));
                    }
                  })()
                }
              />
            ) : null}

            {activeTab === "shipment" ? (
              <ShipmentSection
                shipmentForm={shipmentForm}
                filteredShipments={filteredShipments}
                customers={customers}
                forklifts={forklifts}
                shipmentSearch={shipmentSearch}
                shipmentStatusFilter={shipmentStatusFilter}
                onShipmentFormChange={handleShipmentFormChange}
                onShipmentSearchChange={setShipmentSearch}
                onShipmentStatusFilterChange={setShipmentStatusFilter}
                onAddShipment={handleAddShipment}
                onShipmentStatusChange={(shipmentId) => void handleShipmentStatusChange(shipmentId)}
              />
            ) : null}
          </div>
        </section>
      </Container>
    </div>
  );
}

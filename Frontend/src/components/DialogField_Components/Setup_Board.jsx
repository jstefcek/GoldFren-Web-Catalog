import {useState, useEffect, useRef, useMemo, useCallback, useDeferredValue, memo,} from "react";

const LoadingSkeleton = memo(function LoadingSkeleton({ rows = 7 }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-9 rounded-md bg-gray-100 animate-pulse" />
      ))}
    </div>
  );
});

const VirtualList = memo(function VirtualList({
  items,
  height = 320,
  rowHeight = 48,
  emptyContent,
  renderRow,
  getKey = (item, idx) => item?.__key ?? idx,
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const onScroll = useCallback((e) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const total = items.length;
  const visibleCount = Math.ceil(height / rowHeight);
  const overscan = 4;

  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const end = Math.min(total, start + visibleCount + overscan * 2);

  const padTop = start * rowHeight;
  const padBottom = Math.max(0, (total - end) * rowHeight);

  return (
    <div
      onScroll={onScroll}
      className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-y-scroll"
      style={{ height, scrollbarGutter: "stable both-edges" }}
    >
      <div className="p-4">
        {total === 0 ? (
          emptyContent
        ) : (
          <>
            {padTop > 0 && <div style={{ height: padTop }} />}
            {items.slice(start, end).map((item, idx) => (
              <div
                key={getKey(item, start + idx)}
                style={{ height: rowHeight }}
                className="flex items-center"
              >
                {renderRow(item)}
              </div>
            ))}
            {padBottom > 0 && <div style={{ height: padBottom }} />}
          </>
        )}
      </div>
    </div>
  );
});

const Column = memo(function Column({
  title,
  filterValue,
  onFilterChange,
  disabled,
  countText,
  children,
  t,
  dotColor = "bg-gray-300",
}) {
  return (
    <div className="flex-1 min-w-[280px]">
      {/* Title and Count Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="font-bold text-gray-800 flex items-center gap-2 min-w-0">
          <div className={`h-2 w-2 rounded-full ${dotColor} shrink-0`} />
          <span className="truncate">{title}</span>
        </div>
        <span className="text-xs font-semibold text-gray-500 tabular-nums shrink-0">
          {countText}
        </span>
      </div>

      {/* Filter Field */}
      <div className="relative w-full mb-2">
        <input
          type="text"
          value={filterValue}
          placeholder={t("Filtrovat")}
          onChange={(e) => onFilterChange(e.target.value)}
          disabled={disabled}
          className="w-full px-2 py-1 pr-7 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:bg-gray-100 disabled:text-gray-500"
        />
        <button
          type="button"
          onClick={() => onFilterChange("")}
          disabled={disabled || !filterValue}
          className={`absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 rounded 
            text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition
            ${filterValue && !disabled ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          aria-label={t("Vymazat filtr")}
        >
          ×
        </button>
      </div>

      {children}
    </div>
  );
});

const ItemRow = memo(function ItemRow({
  itemText,
  title,
  mode,
  action,
  disabled,
  onClick,
  buttonLabel,
}) {
  const base =
    "group w-full h-10 flex items-center justify-between gap-2 px-3 rounded-lg border text-left transition-colors select-none";

  const textCls = "text-sm font-medium text-gray-900 truncate leading-snug pr-2 min-w-0";

  const btnBase =
    "h-8 text-xs font-semibold rounded-md shadow-sm transition-colors cursor-pointer flex items-center justify-center";

  const hover = disabled
    ? ""
    : mode === "assigned"
    ? "hover:bg-red-50 hover:border-red-200"
    : mode === "available"
    ? "hover:bg-green-50 hover:border-green-200"
    : "hover:bg-blue-50 hover:border-blue-200";

  const rowTone =
    action === "added"
      ? "bg-green-50 text-green-800 border-green-200"
      : action === "removed"
      ? "bg-red-50 text-red-800 border-red-200"
      : "border-gray-200 bg-gray-50";

  const btnWidth = mode === "changes" ? "min-w-[88px] px-2" : "w-10";

  const btnTone =
    mode === "assigned"
      ? "bg-white text-red-700 border border-red-300 hover:bg-red-50"
      : mode === "available"
      ? "bg-white text-green-700 border border-green-300 hover:bg-green-50"
      : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50";

  const changeBtnTone =
    action === "removed"
      ? "bg-white text-red-700 border border-red-300 hover:bg-red-50"
      : action === "added"
      ? "bg-white text-green-700 border border-green-300 hover:bg-green-50"
      : btnTone;

  return (
    <div className={`${base} ${rowTone} ${hover}`} title={title || ""}>
      <span className={textCls}>{itemText}</span>

      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`${btnBase} ${btnWidth} ${
          mode === "changes" ? changeBtnTone : btnTone
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        {buttonLabel}
      </button>
    </div>
  );
});

/* =========================
   SetupBoard component
   ========================= */

const SetupBoard = memo(function SetupBoard({
  col,
  value,
  t,
  disabled,
  onChange,
  onBlur,
  dialogConfig,
  rowData,
  access_token = null,
}) {
  const normalizeBoard = useCallback(
    (board) => ({
      assigned: Array.isArray(board?.assigned) ? board.assigned : [],
      changes: Array.isArray(board?.changes) ? board.changes : [],
      available: Array.isArray(board?.available) ? board.available : [],
    }),
    []
  );

  const [boardLoading, setBoardLoading] = useState(false);
  const [boardError, setBoardError] = useState(null);

  const touchedRef = useRef(false);
  const lastEmittedRef = useRef(null);

  const doneFetchKeyRef = useRef(null);
  const inFlightFetchKeyRef = useRef(null);

  const [filters, setFilters] = useState({
    assigned: "",
    changes: "",
    available: "",
  });

  const deferredFilters = {
    assigned: useDeferredValue(filters.assigned),
    changes: useDeferredValue(filters.changes),
    available: useDeferredValue(filters.available),
  };

  const enrichItems = useCallback((items, prefix) => {
    const seen = new Map();

    return (items || []).map((raw, idx) => {
      const label = raw.sortiment || raw.label || raw.name || raw.id || "";
      const base =
        `${raw.kod ?? raw.id ?? ""}|${raw.pozice ?? ""}|${label}`.trim() ||
        `${prefix}|${idx}`;

      const count = seen.get(base) || 0;
      seen.set(base, count + 1);

      const key = count ? `${base}#${count}` : base;

      return {
        ...raw,
        label,
        __key: raw.__key || key,
        __search: (raw.__search || label).toString().toLowerCase(),
      };
    });
  }, []);

  const enrichBoard = useCallback(
    (b) => ({
      assigned: enrichItems(b.assigned, "assigned"),
      changes: enrichItems(b.changes, "changes"),
      available: enrichItems(b.available, "available"),
    }),
    [enrichItems]
  );

  const [boardData, setBoardData] = useState(() =>
    enrichBoard(normalizeBoard(value))
  );

  useEffect(() => {
    if (value === lastEmittedRef.current) return;
    const next = enrichBoard(normalizeBoard(value));
    setBoardData(next);
  }, [value, normalizeBoard, enrichBoard]);

  useEffect(() => {
    const currentEndpoint = dialogConfig?.currentEndpoint;
    const availableEndpoint = dialogConfig?.availableEndpoint;
    const rowId = rowData?.kod || rowData?.id;

    if (!currentEndpoint || !availableEndpoint || !rowId) return;

    const fetchKey = `${rowId}::${col.key}`;

    if (doneFetchKeyRef.current === fetchKey) return;
    if (inFlightFetchKeyRef.current === fetchKey) return;

    inFlightFetchKeyRef.current = fetchKey;

    const controller = new AbortController();
    let cancelled = false;

    const fetchBoardData = async () => {
      setBoardLoading(true);
      setBoardError(null);

      try {
        const headers = access_token
          ? { Authorization: `Bearer ${access_token}` }
          : {};
        
        const [assignedRes, availableRes] = await Promise.all([
          fetch(currentEndpoint(rowId, col.key), { signal: controller.signal, headers }),
          fetch(availableEndpoint(rowId, col.key), { signal: controller.signal, headers }),
        ]);

        if (cancelled) return;

        const assignedJson = assignedRes.ok ? await assignedRes.json() : [];
        const availableJson = availableRes.ok ? await availableRes.json() : [];

        const nextBoard = enrichBoard({
          assigned: assignedJson,
          available: availableJson,
          changes: [],
        });

        doneFetchKeyRef.current = fetchKey;

        lastEmittedRef.current = nextBoard;
        setBoardData(nextBoard);
        onChange(col.key, nextBoard);
      } catch (err) {
        if (cancelled) return;
        if (err?.name === "AbortError") return;
        setBoardError(err?.message || "Failed to load data");
      } finally {
        if (inFlightFetchKeyRef.current === fetchKey) {
          inFlightFetchKeyRef.current = null;
        }
        if (!cancelled) setBoardLoading(false);
      }
    };

    fetchBoardData();

    return () => {
      cancelled = true;
      controller.abort();
      if (inFlightFetchKeyRef.current === fetchKey) {
        inFlightFetchKeyRef.current = null;
      }
    };
  }, [
    col.key,
    dialogConfig?.currentEndpoint,
    dialogConfig?.availableEndpoint,
    rowData?.kod,
    rowData?.id,
    enrichBoard,
    onChange,
    access_token,
  ]);

  const labels = useMemo(
    () => ({
      assigned: col.boardLabels?.assigned
        ? t(col.boardLabels.assigned)
        : t("setup_board.assigned"),
      changes: col.boardLabels?.changes
        ? t(col.boardLabels.changes)
        : t("setup_board.changes"),
      available: col.boardLabels?.available
        ? t(col.boardLabels.available)
        : t("setup_board.available"),
    }),
    [col.boardLabels, t]
  );

  const removeByKey = useCallback((arr, k) => arr.filter((x) => x.__key !== k), []);

  const markTouchedOnce = useCallback(() => {
    if (touchedRef.current) return;
    touchedRef.current = true;
    queueMicrotask(() => onBlur(col.key));
  }, [onBlur, col.key]);

  const updateBoard = useCallback(
    (next) => {
      if (disabled) return;

      const enriched = enrichBoard(next);
      lastEmittedRef.current = enriched;


      setBoardData(enriched);
      onChange(col.key, enriched);

      markTouchedOnce();
    },
    [disabled, enrichBoard, onChange, col.key, markTouchedOnce]
  );

  const handleRemoveFromAssigned = useCallback(
    (item) => {
      if (disabled) return;
      const k = item.__key;

      updateBoard({
        assigned: removeByKey(boardData.assigned, k),
        available: removeByKey(boardData.available, k),
        changes: [...boardData.changes, { ...item, action: "removed", __key: `${k}|removed` }],
      });
    },
    [disabled, boardData, removeByKey, updateBoard]
  );

  const handleAddFromAvailable = useCallback(
    (item) => {
      if (disabled) return;
      const k = item.__key;

      updateBoard({
        assigned: removeByKey(boardData.assigned, k),
        available: removeByKey(boardData.available, k),
        changes: [...boardData.changes, { ...item, action: "added", __key: `${k}|added` }],
      });
    },
    [disabled, boardData, removeByKey, updateBoard]
  );

  const handleChangeRemoval = useCallback(
    (change) => {
      if (disabled) return;

      const nextChanges = removeByKey(boardData.changes, change.__key);

      let nextAssigned = boardData.assigned;
      let nextAvailable = boardData.available;

      if (change.action === "added") {
        nextAvailable = [
          ...boardData.available,
          { ...change, __key: change.__key.replace("|added", ""), action: undefined },
        ];
      }
      if (change.action === "removed") {
        nextAssigned = [
          ...boardData.assigned,
          { ...change, __key: change.__key.replace("|removed", ""), action: undefined },
        ];
      }

      updateBoard({ assigned: nextAssigned, changes: nextChanges, available: nextAvailable });
    },
    [disabled, boardData, removeByKey, updateBoard]
  );

  const filterList = useCallback((items, needle) => {
    const n = (needle || "").trim().toLowerCase();
    if (!n) return items;
    return items.filter((x) => (x.__search || "").includes(n));
  }, []);

  const filteredAssigned = useMemo(
    () => filterList(boardData.assigned, deferredFilters.assigned),
    [boardData.assigned, deferredFilters.assigned, filterList]
  );
  const filteredChanges = useMemo(
    () => filterList(boardData.changes, deferredFilters.changes),
    [boardData.changes, deferredFilters.changes, filterList]
  );
  const filteredAvailable = useMemo(
    () => filterList(boardData.available, deferredFilters.available),
    [boardData.available, deferredFilters.available, filterList]
  );

  const renderAssignedRow = useCallback(
    (item) => (
      <ItemRow
        itemText={item.sortiment || item.label || item.name || item.id || ""}
        title={item.label || item.sortiment || ""}
        mode="assigned"
        disabled={disabled}
        buttonLabel="−"
        onClick={() => handleRemoveFromAssigned(item)}
      />
    ),
    [disabled, handleRemoveFromAssigned]
  );

  const renderChangeRow = useCallback(
    (change) => (
      <ItemRow
        itemText={change.sortiment || change.label || change.name || change.id || ""}
        title={change.label || change.sortiment || ""}
        mode="changes"
        action={change.action}
        disabled={disabled}
        buttonLabel={t("Odebrat")}
        onClick={() => handleChangeRemoval(change)}
      />
    ),
    [disabled, handleChangeRemoval, t]
  );

  const renderAvailableRow = useCallback(
    (item) => (
      <ItemRow
        itemText={item.sortiment || item.label || item.name || item.id || ""}
        title={item.label || item.sortiment || ""}
        mode="available"
        disabled={disabled}
        buttonLabel="+"
        onClick={() => handleAddFromAvailable(item)}
      />
    ),
    [disabled, handleAddFromAvailable]
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Board error - text */}
      {boardError && (
        <div className="text-sm text-red-600">{t("Nepodařilo se načíst data")}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Column
          title={labels.assigned}
          t={t}
          disabled={disabled}
          filterValue={filters.assigned}
          onFilterChange={(v) => setFilters((p) => ({ ...p, assigned: v }))}
          countText={`(${filteredAssigned.length}/${boardData.assigned.length})`}
          dotColor="bg-gray-500"
        >
          <VirtualList
            items={filteredAssigned}
            getKey={(item) => item.__key}
            emptyContent={
              boardLoading ? (
                <LoadingSkeleton />
              ) : (
                <span className="text-sm text-gray-500">{t("Žádné přiřazené záznamy")}</span>
              )
            }
            renderRow={renderAssignedRow}
          />
        </Column>

        <Column
          title={labels.changes}
          t={t}
          disabled={disabled}
          filterValue={filters.changes}
          onFilterChange={(v) => setFilters((p) => ({ ...p, changes: v }))}
          countText={`(${filteredChanges.length}/${boardData.changes.length})`}
          dotColor="bg-blue-500"
        >
          <VirtualList
            items={filteredChanges}
            getKey={(item) => item.__key}
            emptyContent={<span className="text-sm text-gray-500">{t("Žádné změny")}</span>}
            renderRow={renderChangeRow}
          />
        </Column>

        <Column
          title={labels.available}
          t={t}
          disabled={disabled}
          filterValue={filters.available}
          onFilterChange={(v) => setFilters((p) => ({ ...p, available: v }))}
          countText={`(${filteredAvailable.length}/${boardData.available.length})`}
          dotColor="bg-green-600"
        >
          <VirtualList
            items={filteredAvailable}
            getKey={(item) => item.__key}
            emptyContent={
              boardLoading ? (
                <LoadingSkeleton />
              ) : (
                <span className="text-sm text-gray-500">{t("Žádné dostupné záznamy")}</span>
              )
            }
            renderRow={renderAvailableRow}
          />
        </Column>
      </div>
    </div>
  );
});

export default SetupBoard;
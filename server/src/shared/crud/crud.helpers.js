// Chuẩn hóa từ khóa tìm kiếm để so khớp không dấu, không phân biệt hoa thường, và chỉ giữ ký tự chữ/số.
const normalizeKeyword = (value) => {
  // Ép mọi kiểu dữ liệu về chuỗi; nếu null/undefined thì dùng chuỗi rỗng.
  return String(value ?? "")
    // Quy đổi riêng ký tự Đ/đ sang D/d để đồng nhất với cơ chế bỏ dấu.
    .replace(/[Đđ]/g, (char) => (char === "Đ" ? "D" : "d"))
    // Tách dấu tiếng Việt ra khỏi ký tự gốc (decompose Unicode).
    .normalize("NFD")
    // Xóa toàn bộ dấu kết hợp sau khi đã tách.
    .replace(/[\u0300-\u036f]/g, "")
    // Đưa về chữ thường để tìm kiếm không phân biệt hoa/thường.
    .toLowerCase()
    // Loại bỏ mọi ký tự không phải a-z hoặc 0-9.
    .replace(/[^a-z0-9]/g, "");
};

// Chuẩn hóa mô tả field tìm kiếm: chấp nhận cả dạng chuỗi ngắn gọn và object descriptor.
const normalizeSearchField = (field) => {
  // Nếu truyền trực tiếp tên field dạng chuỗi thì bọc lại thành descriptor mặc định kiểu string.
  if (typeof field === "string") {
    return { field, type: "string" };
  }

  // Nếu đã là object descriptor thì giữ nguyên.
  return field;
};

// Đưa input về mảng để xử lý đồng nhất cho cả single value và list value.
const toArray = (value) => {
  // Nếu đã là mảng thì dùng luôn.
  if (Array.isArray(value)) {
    return value;
  }

  // Nếu không có dữ liệu thì trả mảng rỗng.
  if (value === undefined || value === null) {
    return [];
  }

  // Trường hợp còn lại: bọc giá trị đơn vào mảng 1 phần tử.
  return [value];
};

// Kiểm tra giá trị có thực sự "có dữ liệu" hay không.
const hasNonEmptyValue = (value) => {
  // undefined/null được xem là rỗng.
  if (value === undefined || value === null) {
    return false;
  }

  // Chuỗi chỉ chứa khoảng trắng cũng được xem là rỗng.
  if (typeof value === "string") {
    return value.trim() !== "";
  }

  // Các kiểu còn lại (number/boolean/object...) được coi là có giá trị.
  return true;
};

// Resolve keyword tìm kiếm enum thành danh sách giá trị enum hợp lệ.
const resolveEnumSearchValues = (keyword, descriptor = {}) => {
  // Lấy tập giá trị enum cho phép từ descriptor.values.
  const allowedValues = toArray(descriptor.values)
    // Chuẩn hóa từng phần tử về chuỗi để so sánh nhất quán.
    .map((value) => String(value))
    // Loại bỏ phần tử rỗng/blank.
    .filter((value) => value.trim() !== "");
  // Tạo Set để kiểm tra membership nhanh O(1).
  const allowedSet = new Set(allowedValues);
  // Nếu không khai báo values thì cho phép map sang bất kỳ giá trị nào từ alias.
  const canUseAnyValue = allowedValues.length === 0;
  // Tạo map normalizedValue -> originalValue để hỗ trợ so khớp trực tiếp không dấu.
  const allowedByNormalized = new Map(
    allowedValues.map((value) => [normalizeKeyword(value), value]),
  );
  // Dùng Set để tránh trùng lặp khi gom kết quả từ nhiều nguồn.
  const resolvedValues = new Set();
  // Chuẩn hóa keyword đầu vào trước khi so khớp.
  const normalizedKeyword = normalizeKeyword(keyword);

  // Nếu keyword rỗng sau chuẩn hóa thì không trả kết quả.
  if (!normalizedKeyword) {
    return [];
  }

  // Duyệt từng alias khai báo để map keyword người dùng sang enum value chuẩn.
  Object.entries(descriptor.aliases ?? {}).forEach(([alias, mappedValues]) => {
    // Bỏ qua alias không trùng keyword sau chuẩn hóa.
    if (normalizeKeyword(alias) !== normalizedKeyword) {
      return;
    }

    // Alias có thể map tới một hoặc nhiều giá trị nên luôn xử lý ở dạng mảng.
    toArray(mappedValues).forEach((value) => {
      // Chuẩn hóa mapped value về chuỗi.
      const mappedValue = String(value);

      // Chỉ nhận mapped value nếu được cho phép, hoặc descriptor không giới hạn danh sách values.
      if (canUseAnyValue || allowedSet.has(mappedValue)) {
        resolvedValues.add(mappedValue);
      }
    });
  });

  // Kiểm tra thêm trường hợp keyword khớp trực tiếp một enum value (sau normalize).
  const directMatch = allowedByNormalized.get(normalizedKeyword);

  // Nếu có khớp trực tiếp thì thêm vào tập kết quả.
  if (directMatch) {
    resolvedValues.add(directMatch);
  }

  // Trả về mảng giá trị enum hợp lệ cuối cùng.
  return Array.from(resolvedValues);
};

// Resolve input filter enum (single/multi) thành danh sách enum value hợp lệ.
const resolveEnumFilterValues = (input, descriptor = {}) => {
  // Dùng Set để loại trùng giữa nhiều giá trị đầu vào.
  const resolvedValues = new Set();

  // Luôn duyệt input dưới dạng mảng để hỗ trợ cả 1 giá trị và nhiều giá trị.
  toArray(input).forEach((value) => {
    // Bỏ qua giá trị rỗng/không hợp lệ.
    if (!hasNonEmptyValue(value)) {
      return;
    }

    // Resolve từng giá trị theo cùng logic enum search.
    const matchedValues = resolveEnumSearchValues(value, descriptor);

    // Không có kết quả thì bỏ qua phần tử này.
    if (matchedValues.length === 0) {
      return;
    }

    // Gom toàn bộ giá trị resolve được vào tập kết quả chung.
    matchedValues.forEach((resolvedValue) => {
      resolvedValues.add(resolvedValue);
    });
  });

  // Trả về mảng giá trị enum duy nhất.
  return Array.from(resolvedValues);
};

// Tạo điều kiện where cho phần tìm kiếm theo từ khóa trên các field cấu hình.
const buildSearchCondition = (search, fields = []) => {
  // Cắt khoảng trắng 2 đầu từ khóa tìm kiếm.
  const keyword = search?.trim();

  // Không có keyword hoặc không có field tìm kiếm thì không tạo điều kiện.
  if (!keyword || fields.length === 0) {
    return {};
  }

  // Tạo danh sách điều kiện OR cho từng field tìm kiếm.
  const conditions = fields
    // Chuẩn hóa từng khai báo field về dạng descriptor object.
    .map(normalizeSearchField)
    // Với mỗi descriptor, sinh ra 0..n điều kiện where tương ứng.
    .flatMap((descriptor) => {
      // Bỏ qua descriptor thiếu tên field.
      if (!descriptor?.field) {
        return [];
      }

      // Field kiểu enum dùng cơ chế resolve keyword sang danh sách giá trị enum.
      if (descriptor.type === "enum") {
        const values = resolveEnumSearchValues(keyword, descriptor);

        // Nếu không resolve được enum value nào thì không tạo điều kiện cho field này.
        if (values.length === 0) {
          return [];
        }

        // Enum search tạo điều kiện IN trên field đích.
        return [{ [descriptor.field]: { in: values } }];
      }

      // Field chuỗi tạo điều kiện contains keyword.
      return [{ [descriptor.field]: { contains: keyword } }];
    });

  // Nếu không sinh ra điều kiện hợp lệ nào thì trả object rỗng.
  if (conditions.length === 0) {
    return {};
  }

  // Trả where dạng OR giữa tất cả điều kiện search.
  return { OR: conditions };
};

// Tạo điều kiện where cho phần filter theo cấu hình filterFields.
const buildFilterCondition = (filters = {}, filterFields = {}) => {
  // Mảng gom các điều kiện lọc độc lập.
  const conditions = [];
  // Lưu tạm điều kiện khoảng ngày theo từng field đích để gộp gte/lte.
  const dateRangeConditions = new Map();
  // Danh sách kiểu filter được hỗ trợ chính thức.
  const supportedFilterTypes = new Set([
    "string",
    "enum",
    "number",
    "decimal",
    "dateFrom",
    "dateTo",
  ]);

  // Duyệt toàn bộ cấu hình filter để build where tương ứng cho từng field.
  Object.entries(filterFields).forEach(([field, descriptor]) => {
    // Lấy kiểu filter từ descriptor.
    const filterType = descriptor?.type;

    // Chặn sớm kiểu filter không hợp lệ để tránh tạo query sai.
    if (!supportedFilterTypes.has(filterType)) {
      throw new Error(`Unsupported filter type: ${String(filterType)} for field ${field}`);
    }

    // Lấy giá trị filter thực tế từ input theo tên field cấu hình.
    const value = filters[field];

    // Bỏ qua giá trị không tồn tại hoặc chuỗi rỗng.
    if (value === undefined || value === null || value === "") {
      return;
    }

    // Xử lý filter kiểu chuỗi chính xác (sau khi trim nếu là string).
    if (filterType === "string") {
      // Chuỗi toàn khoảng trắng thì bỏ qua.
      if (typeof value === "string" && value.trim() === "") {
        return;
      }

      // Đẩy điều kiện so sánh bằng vào danh sách AND.
      conditions.push({ [field]: typeof value === "string" ? value.trim() : value });
      return;
    }

    // Xử lý filter kiểu enum (hỗ trợ alias và nhiều giá trị).
    if (filterType === "enum") {
      const values = resolveEnumFilterValues(value, descriptor);

      // Không resolve được giá trị enum hợp lệ thì bỏ qua.
      if (values.length === 0) {
        return;
      }

      // Nếu cho phép multi hoặc thực tế có nhiều giá trị thì dùng điều kiện IN.
      if (descriptor.multi || values.length > 1) {
        conditions.push({ [field]: { in: values } });
        return;
      }

      // Trường hợp còn lại chỉ lấy 1 giá trị enum duy nhất.
      conditions.push({ [field]: values[0] });
      return;
    }

    // Xử lý filter số nguyên/thập phân: ép Number và bỏ qua nếu NaN.
    if (filterType === "number" || filterType === "decimal") {
      // Nếu nhận mảng thì dùng phần tử đầu tiên làm giá trị chính.
      const rawValue = Array.isArray(value) ? value[0] : value;

      // Chuỗi rỗng sau trim thì bỏ qua.
      if (typeof rawValue === "string" && rawValue.trim() === "") {
        return;
      }

      // Ép kiểu dữ liệu về number để query nhất quán.
      const numberValue = Number(rawValue);

      // Không thêm điều kiện nếu ép số thất bại.
      if (Number.isNaN(numberValue)) {
        return;
      }

      // Thêm điều kiện so sánh bằng cho field số.
      conditions.push({ [field]: numberValue });
      return;
    }

    // Xử lý filter ngày bắt đầu/kết thúc để tạo khoảng thời gian gte/lte.
    if (filterType === "dateFrom" || filterType === "dateTo") {
      // Nếu nhận mảng thì dùng phần tử đầu tiên.
      const rawValue = Array.isArray(value) ? value[0] : value;

      // Chuỗi rỗng sau trim thì bỏ qua.
      if (typeof rawValue === "string" && rawValue.trim() === "") {
        return;
      }

      // Parse giá trị đầu vào thành Date.
      const dateValue = new Date(rawValue);

      // Parse lỗi thì bỏ qua.
      if (Number.isNaN(dateValue.getTime())) {
        return;
      }

      // Xác định field đích cho khoảng ngày theo thứ tự ưu tiên cấu hình.
      const targetField =
        descriptor.targetField ??
        descriptor.field ??
        (filterType === "dateFrom" ? field.replace(/From$/, "") : field.replace(/To$/, ""));
      // Lấy condition đã có để gộp với phần còn lại của cùng targetField.
      const condition = dateRangeConditions.get(targetField) ?? {};

      // dateFrom ánh xạ thành cận dưới gte.
      if (filterType === "dateFrom") {
        condition.gte = dateValue;
      } else {
        // Nếu là chuỗi chỉ có ngày (yyyy-mm-dd) thì kéo tới cuối ngày để lọc inclusive.
        const isDateOnlyString = typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawValue);
        condition.lte = isDateOnlyString
          ? new Date(dateValue.getTime() + 24 * 60 * 60 * 1000 - 1)
          // Nếu có cả thời gian thì giữ nguyên mốc thời gian người dùng nhập.
          : dateValue;
      }

      // Lưu lại condition khoảng ngày theo field đích.
      dateRangeConditions.set(targetField, condition);
      return;
    }
  });

  // Sau khi duyệt xong, đẩy từng điều kiện khoảng ngày đã gộp vào mảng conditions.
  dateRangeConditions.forEach((condition, field) => {
    // Bỏ qua condition rỗng (phòng thủ).
    if (Object.keys(condition).length === 0) {
      return;
    }

    // Thêm where cho field ngày tương ứng.
    conditions.push({ [field]: condition });
  });

  // Không có điều kiện lọc nào thì trả object rỗng.
  if (conditions.length === 0) {
    return {};
  }

  // Trả where dạng AND cho toàn bộ điều kiện filter.
  return { AND: conditions };
};

// Kết hợp đồng thời search condition và filter condition thành where cuối cho API list.
const buildListWhere = ({
  // Từ khóa tìm kiếm tự do.
  search = "",
  // Tập filter đầu vào từ query.
  filters = {},
  // Danh sách field dùng cho search.
  searchFields = [],
  // Cấu hình descriptor cho từng filter field.
  filterFields = {},
} = {}) => {
  // Build điều kiện search từ keyword + search fields.
  const searchCondition = buildSearchCondition(search, searchFields);
  // Build điều kiện filter từ filters + filter descriptors.
  const filterCondition = buildFilterCondition(filters, filterFields);
  // Kiểm tra searchCondition có dữ liệu hay không.
  const hasSearchCondition = Object.keys(searchCondition).length > 0;
  // Kiểm tra filterCondition có dữ liệu hay không.
  const hasFilterCondition = Object.keys(filterCondition).length > 0;

  // Không có search lẫn filter thì trả where rỗng.
  if (!hasSearchCondition && !hasFilterCondition) {
    return {};
  }

  // Chỉ có filter thì trả nguyên filter condition.
  if (!hasSearchCondition) {
    return filterCondition;
  }

  // Chỉ có search thì trả nguyên search condition.
  if (!hasFilterCondition) {
    return searchCondition;
  }

  // Có cả hai thì gộp bằng AND: searchCondition + các điều kiện filter con.
  return {
    AND: [searchCondition, ...filterCondition.AND],
  };
};

// Lọc payload theo whitelist field để chỉ ghi xuống DB các trường được phép.
const buildWriteData = (payload, allowedFields = []) => {
  return Object.fromEntries(
    // Tạo cặp [field, value] theo danh sách cho phép.
    allowedFields
      .map((field) => [field, payload[field]])
      // Loại bỏ field không được truyền (undefined) để tránh ghi đè không mong muốn.
      .filter(([, value]) => value !== undefined),
  );
};

// Chuẩn hóa thông tin phân trang từ query string/page params.
const buildPagination = ({ page = 1, limit = 10 } = {}) => {
  // currentPage chỉ nhận số nguyên dương; sai định dạng thì fallback về 1.
  const currentPage = Number.isInteger(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  // pageSize chỉ nhận số nguyên dương; sai định dạng thì fallback về 10.
  const pageSize =
    Number.isInteger(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;

  // Trả thông tin page/limit và skip để dùng trực tiếp cho Prisma findMany.
  return {
    page: currentPage,
    limit: pageSize,
    skip: (currentPage - 1) * pageSize,
  };
};

// Tạo lỗi service thống nhất có gắn HTTP status để tầng trên xử lý.
const buildServiceError = (status, message) => {
  // Khởi tạo Error object với message nghiệp vụ.
  const error = new Error(message);
  // Gắn status HTTP vào object lỗi.
  error.status = status;
  // Trả lỗi để throw ở service/controller.
  return error;
};

// Export các helper dùng lại cho CRUD factory/service.
export {
  buildFilterCondition,
  buildListWhere,
  buildPagination,
  buildSearchCondition,
  buildServiceError,
  buildWriteData,
  normalizeKeyword,
};

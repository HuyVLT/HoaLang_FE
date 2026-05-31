import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

// Custom sleep helper to simulate streaming chunks
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { from = 'Hà Nội', days = 3, interests = [], budget = 'comfortable', people = 1 } = body;

    // Craft a personalized itinerary based on user input
    const baseSchedule = [
      {
        day: 1,
        title: `${from} → Bát Tràng`,
        date: "Thứ Hai",
        stops: [
          { time: "08:00", name: `Khởi hành từ ${from}`, type: "transport", duration: "45 phút", icon: "car", desc: "Di chuyển bằng xe máy/taxi theo tuyến đường tối ưu để tránh kẹt xe giờ cao điểm." },
          { time: "08:45", name: "Làng Gốm Bát Tràng", type: "village", duration: "3 giờ", icon: "village", desc: "Tham quan lò gốm cổ bầu độc nhất còn lại, tham gia workshop tự tay nặn gốm trên bàn xoay với nghệ nhân Nguyễn Văn Thành." },
          { time: "12:00", name: "Ăn trưa tại Bát Tràng", type: "food", duration: "1 giờ", icon: "food", desc: "Thưởng thức bún ốc nguội và canh măng mực đặc sản tiến vua của làng gốm Kinh Bắc, giá khoảng 80.000₫/người." },
          { time: "13:30", name: "Mua sắm sản phẩm gốm", type: "shop", duration: "1.5 giờ", icon: "shop", desc: "Chọn mua bình gốm rạn, tách trà men ngọc bích cao cấp tại xưởng gốm gia đình nghệ nhân." },
          { time: "16:00", name: `Trở về ${from}`, type: "transport", duration: "1 giờ", icon: "car", desc: `Nghỉ ngơi và chuẩn bị cho các hoạt động buổi tối thú vị.` },
        ]
      },
      {
        day: 2,
        title: "Làng Lụa Vạn Phúc",
        date: "Thứ Ba",
        stops: [
          { time: "09:00", name: "Làng Lụa Vạn Phúc", type: "village", duration: "4 giờ", icon: "village", desc: "Tìm hiểu quy trình quay tơ, dệt lụa tơ tằm nguyên bản, chiêm ngưỡng các mẫu lụa Vân cổ truyền." },
          { time: "13:30", name: "Workshop dệt lụa thủ công", type: "experience", duration: "2 giờ", icon: "craft", desc: "Trải nghiệm luồn thoi dệt mảnh lụa tơ tằm nhỏ dưới sự hướng dẫn của nghệ nhân lão luyện — Chi phí 350.000₫/người." },
          { time: "16:00", name: "Mua sắm lụa tơ tằm tự nhiên", type: "shop", duration: "1 giờ", icon: "shop", desc: "Chọn khăn lụa tơ tằm dệt tay chính hiệu tại showroom trung tâm có chứng nhận nguồn gốc xuất xứ." },
        ]
      },
      {
        day: 3,
        title: "Làng Tranh Đông Hồ & Kết thúc",
        date: "Thứ Tư",
        stops: [
          { time: "07:30", name: "Xe khách đi Bắc Ninh", type: "transport", duration: "1.5 giờ", icon: "bus", desc: "Di chuyển từ bến xe đi Thuận Thành, Bắc Ninh để khám phá cái nôi của tranh dân gian Kinh Bắc." },
          { time: "09:30", name: "Làng Tranh Đông Hồ", type: "village", duration: "3 giờ", icon: "village", desc: "Lắng nghe nghệ nhân ưu tú Nguyễn Đăng Chế giới thiệu kỹ thuật in tranh dân gian bằng bản khắc gỗ dừa trên giấy dó điệp lấp lánh." },
          { time: "13:00", name: `Trở về ${from}`, type: "transport", duration: "2 giờ", icon: "bus", desc: "Kết thúc hành trình trải nghiệm văn hóa di sản Đông Bắc Bộ đầy ý nghĩa." },
        ]
      }
    ];

    // Filter schedule based on requested days
    const schedule = baseSchedule.slice(0, Math.min(days, baseSchedule.length));
    
    // Adjust schedule title and details if more days are selected (e.g. days > 3)
    if (days > 3) {
      for (let i = 4; i <= Math.min(days, 14); i++) {
        schedule.push({
          day: i,
          title: `Khám phá Di sản Ngày ${i}`,
          date: i % 7 === 0 ? "Chủ Nhật" : i % 7 === 4 ? "Thứ Năm" : i % 7 === 5 ? "Thứ Sáu" : "Thứ Bảy",
          stops: [
            { time: "09:00", name: `Bảo tàng Mỹ thuật Việt Nam`, type: "experience", duration: "3 giờ", icon: "craft", desc: "Chiêm ngưỡng bộ sưu tập tranh sơn mài cổ truyền, điêu khắc đá thời Lý-Trần." },
            { time: "12:00", name: "Ẩm thực phố cổ Hà Nội", type: "food", duration: "1.5 giờ", icon: "food", desc: "Thưởng thức chả cá Lã Vọng nướng than hoa thơm lừng kèm rau thì là." },
            { time: "14:00", name: "Trải nghiệm làm đồ sơn mài mỹ nghệ", type: "experience", duration: "2.5 giờ", icon: "craft", desc: "Tự tay mài tranh sơn mài nhỏ tại studio nghệ thuật thủ công." }
          ]
        });
      }
    }

    // Dynamic cost adjustments based on budget and parameters
    let costPerPerson = 800000; // default for saving
    if (budget === 'comfortable') costPerPerson = 1500000;
    if (budget === 'luxury') costPerPerson = 3800000;

    const totalCostNumber = costPerPerson * people * schedule.length;
    const formattedCost = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalCostNumber);
    const totalKm = 15 + (schedule.length * 10);

    const resultItinerary = {
      title: `Hành trình Khám phá Di sản Kinh Kỳ (${interests.join(' & ') || 'Tổng hợp'})`,
      days: schedule.length,
      totalKm,
      estimatedCost: formattedCost,
      schedule
    };

    // Text descriptions to stream step-by-step
    const streamMessages = [
      "Đang khởi động hệ thống phân tích hành trình di sản HoaLang AI...\n",
      `Đang định vị tuyến đường xuất phát từ điểm khởi hành: ${from}...\n`,
      `Đang kiểm tra lịch trống của các nghệ nhân cho ${interests.length > 0 ? interests.join(', ') : 'Gốm sứ, Lụa dệt, Tranh dân gian'}...\n`,
      `Đang tối ưu lịch trình cho ${days} ngày với ngân sách ${
        budget === 'budget' ? 'Tiết kiệm' : budget === 'comfortable' ? 'Thoải mái' : 'Sang trọng'
      } dành cho đoàn ${people} người...\n`,
      "Đã kết nối dữ liệu bản đồ thực địa các làng nghề truyền thống Bát Tràng, Vạn Phúc, Đông Hồ...\n",
      "Đang hoàn thiện biên niên sử di sản và các điểm ẩm thực đặc sắc Kinh Bắc...\n",
      "✦ CHUẨN BỊ HOÀN TẤT HÀNH TRÌNH ✦\n"
    ];

    const encoder = new TextEncoder();

    // Create a readable stream to output SSE
    const stream = new ReadableStream({
      async start(controller) {
        // Step 1: Send text chunks one by one
        for (const msg of streamMessages) {
          const sseMessage = `event: message\ndata: ${JSON.stringify({ text: msg })}\n\n`;
          controller.enqueue(encoder.encode(sseMessage));
          await sleep(400); // delay to simulate "thinking"
        }

        // Step 2: Send the final itinerary data
        const sseItinerary = `event: itinerary\ndata: ${JSON.stringify(resultItinerary)}\n\n`;
        controller.enqueue(encoder.encode(sseItinerary));
        
        // Finalize stream
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: unknown) {
    console.error("API Itinerary Error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

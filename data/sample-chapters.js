// Dữ liệu mẫu cho các chương sách
const sampleChapters = [
  // Chương mẫu cho sách "Đắc Nhân Tâm"
  {
    title: "Đắc Nhân Tâm - Chương 1: Những nguyên tắc cơ bản",
    content: `<p>Cách đây nhiều năm, tại New York, tôi là một trong 500 người tham dự một khóa học về nghệ thuật nói trước công chúng do Dale Carnegie tổ chức.</p>
              <p>Những người đàn ông và phụ nữ từ khắp nơi trong thành phố đã tham dự lớp học. Họ đến từ mọi tầng lớp của xã hội: họ là những người bán hàng, nhân viên ngân hàng, kế toán viên, kiến trúc sư, kỹ sư, bác sĩ, luật sư và nhiều người khác đang cố gắng thoát khỏi sự nhạt nhẽo trong những bài phát biểu.</p>
              <p>Lúc đầu, bầu không khí của khán phòng căng thẳng và đầy sự nghi ngờ. Hầu hết chúng tôi đều nghi ngờ là mình có thể thành công hay không, và tất cả chúng tôi đều băn khoăn không biết người này nghĩ gì về người kia.</p>
              <p>Tuy nhiên, khi khóa học tiến triển, chúng tôi dần dần làm quen với nhau, sự thù địch biến mất, và cuối cùng chúng tôi đã trở thành những người bạn. Sau đó, chúng tôi mong đợi mỗi buổi học như một dịp hội ngộ thú vị.</p>`,
    bookId: null, // Sẽ được điền sau khi tạo sách
    order: 1
  },
  {
    title: "Đắc Nhân Tâm - Chương 2: Làm quen với mọi người",
    content: `<p>Nếu bạn muốn có được bạn bè, hãy làm việc này và bạn sẽ có được bạn bè nhiều hơn so với việc có thể kiếm được trong suốt 10 năm nỗ lực để khiến mọi người quan tâm đến bạn.</p>
              <p>Tôi đã đi khắp thế giới và kết bạn với người ở mọi nơi từ Đông sang Tây. Và tôi đã thấy rằng những chú chó có nhiều bạn hơn tôi vì chúng thích những người khác hơn tôi thích.</p>
              <p>Bí quyết để làm quen với mọi người: <strong>Thể hiện sự quan tâm chân thành</strong>.</p>
              <p>Alfred Adler đã viết trong quyển sách nổi tiếng của ông "Ý nghĩa cuộc sống" những lời lẽ mà mỗi chúng ta nên khắc sâu trong tâm trí: "Cá nhân nào không quan tâm đến người đồng loại của mình là kẻ gặp nhiều khó khăn nhất trong cuộc sống và gây tổn thương lớn nhất đến người khác. Từ những cá nhân như vậy phát sinh mọi thất bại của con người."</p>`,
    bookId: null, // Sẽ được điền sau khi tạo sách
    order: 2
  },
  
  // Chương mẫu cho sách "Nhà Giả Kim"
  {
    title: "Nhà Giả Kim - Chương 1: Cuộc gặp gỡ với nhà giả kim",
    content: `<p>Chàng trai đã đến được thành phố nằm bên một tòa lâu đài cổ kính của người Moors. Chàng quyết định tìm một quán trọ nghỉ ngơi qua đêm và sáng hôm sau sẽ tìm một người có thể dẫn chàng đến tận Kim tự tháp.</p>
              <p>Vừa ngồi vào quán cà phê, một người đàn ông lớn tuổi đến bắt chuyện với chàng. Ông ta nhìn thấy có gì đó khác lạ ở chàng trai này.</p>
              <p>"Tại sao cậu lại đến vùng đất này?", người đàn ông hỏi.</p>
              <p>"Tôi đang tìm kiếm một kho báu," chàng trai đáp một cách thành thật.</p>
              <p>Người đàn ông lặng im một chút rồi mỉm cười: "Ta là nhà giả kim. Ta có thể giúp cậu tìm thấy kho báu đó."</p>
              <p>Và như thế, cuộc hành trình của chàng trai Santiago đã bắt đầu.</p>`,
    bookId: null, // Sẽ được điền sau khi tạo sách
    order: 1
  },
  {
    title: "Nhà Giả Kim - Chương 2: Cuộc hành trình tìm kiếm kho báu",
    content: `<p>Ánh nắng bắt đầu ló dạng và chàng trai tiếp tục cuộc hành trình. Một ngày mới lại bắt đầu, và với nó là những thử thách mới, nhưng cũng là những cơ hội mới.</p>
              <p>"Khi bạn thực sự muốn một điều gì đó, cả vũ trụ sẽ hợp lực giúp bạn đạt được điều đó," nhà giả kim đã nói với chàng như vậy.</p>
              <p>Santiago bắt đầu hiểu rằng, kho báu thực sự không phải là đích đến, mà chính là cuộc hành trình. Mỗi người đều có vận mệnh riêng, và nhiệm vụ của chúng ta là lắng nghe trái tim mình, dõi theo những dấu hiệu, và dũng cảm theo đuổi giấc mơ.</p>
              <p>"Hãy lắng nghe trái tim mình. Nó biết mọi thứ, bởi vì nó đến từ Linh hồn Thế giới, và một ngày nào đó nó sẽ trở về nơi đó."</p>`,
    bookId: null, // Sẽ được điền sau khi tạo sách
    order: 2
  },
  
  // Chương mẫu cho sách "Tuổi Trẻ Đáng Giá Bao Nhiêu"
  {
    title: "Tuổi Trẻ Đáng Giá Bao Nhiêu - Chương 1: Học, Làm, Đi",
    content: `<p>Tôi thường được hỏi câu này: "Nếu quay ngược thời gian về khoảng thời gian đôi mươi, bạn sẽ làm gì khác đi?" - Và câu trả lời của tôi vẫn luôn là: Tôi sẽ học nhiều hơn, làm nhiều hơn, và đi nhiều hơn.</p>
              <p>Tuổi trẻ là khoảng thời gian quý giá nhất cuộc đời chúng ta. Đó là lúc chúng ta có nhiều năng lượng, nhiều mơ ước và ít ràng buộc nhất. Đó cũng là lúc chúng ta mắc nhiều sai lầm nhất, nhưng may mắn thay, đó cũng là lúc chúng ta có nhiều thời gian nhất để sửa chữa chúng.</p>
              <p>Đa số chúng ta đều sống như thể chúng ta có vô hạn thời gian. Chúng ta lãng phí từng giây phút quý giá vào những việc vô nghĩa, rồi một ngày thức dậy, nhận ra tuổi trẻ của mình đã qua đi mất rồi. Và chúng ta bắt đầu tự hỏi: Tuổi trẻ của tôi đã đáng giá bao nhiêu?</p>
              <p>Thời gian là thứ tài sản quý giá nhất của chúng ta, và tuổi trẻ là khoảng thời gian đẹp nhất. Hãy sử dụng nó một cách khôn ngoan.</p>`,
    bookId: null, // Sẽ được điền sau khi tạo sách
    order: 1
  },
  {
    title: "Tuổi Trẻ Đáng Giá Bao Nhiêu - Chương 2: Đừng lựa chọn an nhàn khi còn trẻ",
    content: `<p>Nhiều người trẻ lựa chọn một công việc ổn định, lương cao và không nhiều thách thức ngay từ đầu sự nghiệp. Họ muốn có một cuộc sống an nhàn, thoải mái càng sớm càng tốt.</p>
              <p>Đó là một sai lầm lớn.</p>
              <p>Tuổi trẻ là lúc bạn cần phải thử thách bản thân, là lúc bạn còn đủ sức để làm việc 12 tiếng một ngày, là lúc bạn có thể thất bại và đứng dậy mà không có quá nhiều gánh nặng. Đừng lựa chọn an nhàn khi còn trẻ, bởi vì sự an nhàn sẽ khiến bạn không phát triển.</p>
              <p>Thay vào đó, hãy tìm kiếm những thử thách, những công việc có thể giúp bạn học hỏi và phát triển, dù có thể chúng không mang lại nhiều tiền bạc hay sự thoải mái ngay lập tức. Hãy nhớ rằng, sự đầu tư vào bản thân ở tuổi trẻ sẽ mang lại lợi nhuận kép trong tương lai.</p>
              <p>Sau cùng, định nghĩa thành công của mỗi người là khác nhau. Có người coi sự giàu có là thành công, có người lại coi sự tự do là thành công. Nhưng dù định nghĩa của bạn là gì, một điều chắc chắn rằng: Không có con đường nào đến thành công mà không đòi hỏi sự nỗ lực và hy sinh.</p>`,
    bookId: null,
    order: 2
  },
  
  // Chương mẫu cho sách "Tôi Tài Giỏi, Bạn Cũng Thế"
  {
    title: "Tôi Tài Giỏi, Bạn Cũng Thế - Chương 1: Tiềm năng vô hạn",
    content: `<p>Khi tôi 8 tuổi, tôi là một học sinh tệ nhất trong lớp. Các bạn gọi tôi là "kẻ chậm hiểu", và các giáo viên nói rằng tôi không có khả năng học tập. Cha mẹ tôi xấu hổ về tôi đến mức họ không muốn đến trường dự các buổi họp phụ huynh.</p>
              <p>Trong vòng 3 năm, tôi đã chuyển từ vị trí cuối lớp thành một trong những học sinh xuất sắc nhất của trường. Tôi không đột nhiên thông minh hơn hay có trí nhớ tốt hơn. Điều thay đổi là cách tôi học.</p>
              <p>Mỗi người chúng ta đều sinh ra với tiềm năng vô hạn. Bạn có thể học bất cứ điều gì, đạt được bất cứ điều gì nếu bạn biết cách sử dụng bộ não của mình một cách đúng đắn.</p>
              <p>Nhưng rất tiếc, hầu hết chúng ta không được dạy cách học hiệu quả ở trường. Chúng ta được dạy toán, văn, sử, địa... nhưng chúng ta không được dạy cách học những môn này một cách hiệu quả nhất.</p>
              <p>Đó là lý do tại sao có rất nhiều học sinh thông minh nhưng kết quả học tập lại không tốt. Không phải vì họ không có khả năng, mà là vì họ không biết cách khai thác tiềm năng của mình.</p>`,
    bookId: null,
    order: 1
  },
  {
    title: "Tôi Tài Giỏi, Bạn Cũng Thế - Chương 2: Bảy bước học tập hiệu quả",
    content: `<p>Học tập hiệu quả không phải là học nhiều hơn, mà là học thông minh hơn. Sau đây là bảy bước giúp bạn học tập hiệu quả:</p>
              <p><strong>1. Đặt mục tiêu rõ ràng</strong>: Trước khi bắt đầu học, hãy xác định rõ bạn muốn đạt được điều gì. Mục tiêu càng cụ thể càng tốt.</p>
              <p><strong>2. Tạo môi trường học tập tối ưu</strong>: Môi trường học tập ảnh hưởng rất lớn đến hiệu quả học tập. Hãy chọn một nơi yên tĩnh, đủ ánh sáng và không có những yếu tố gây xao nhãng.</p>
              <p><strong>3. Sử dụng phương pháp ghi chú hiệu quả</strong>: Thay vì ghi chép mọi thứ, hãy tập trung vào các ý chính và sử dụng sơ đồ tư duy để kết nối các ý tưởng.</p>
              <p><strong>4. Kích hoạt đa giác quan</strong>: Càng sử dụng nhiều giác quan trong quá trình học, bạn càng nhớ lâu. Hãy đọc to, viết ra, giải thích cho người khác nghe.</p>
              <p><strong>5. Học theo chu kỳ</strong>: Thay vì học liên tục trong nhiều giờ, hãy chia nhỏ thành các phiên học 25-30 phút, nghỉ ngơi 5 phút giữa các phiên.</p>
              <p><strong>6. Ôn tập đúng cách</strong>: Ôn tập không phải là đọc lại nhiều lần, mà là tự kiểm tra kiến thức của mình qua việc trả lời câu hỏi hoặc giải thích cho người khác.</p>
              <p><strong>7. Duy trì trạng thái tích cực</strong>: Thái độ quyết định tất cả. Tin rằng bạn có thể học được và sẽ thành công.</p>
              <p>Áp dụng bảy bước này, bạn sẽ thấy kết quả học tập của mình cải thiện đáng kể. Hãy nhớ rằng, không có học sinh kém, chỉ có phương pháp học không hiệu quả.</p>`,
    bookId: null,
    order: 2
  },
  
];

module.exports = sampleChapters;

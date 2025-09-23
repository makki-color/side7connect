export default function Home() {
  return (
    <div className="bg-blue-900 text-white min-h-screen p-4 bg-gradient-to-r from-blue-900 to-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-center">ガンプラ＆グッズ</h1>
      <input
        type="text"
        placeholder="RGνガンダムをロックオン！"
        className="w-full p-2 mb-4 text-black rounded-lg border-2 border-white"
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <p>ここにガンプラが並ぶ予定！</p>
      </div>
    </div>
  );
}
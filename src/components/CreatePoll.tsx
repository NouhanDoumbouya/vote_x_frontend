import { useState } from 'react';
import { Navbar } from './Navbar';
import { ArrowLeft, Plus, X, Sparkles, Clock, Tag } from 'lucide-react';

type CreatePollProps = {
  onCreatePoll: (pollData: {
    title: string;
    description: string;
    options: string[];
    duration: string;
    category: string;
  }) => void;
  onBack: () => void;
};

export function CreatePoll({ onCreatePoll, onBack }: CreatePollProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState('3 days');
  const [category, setCategory] = useState('General');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'General',
    'Technology',
    'Education',
    'Food & Dining',
    'Events',
    'Entertainment',
    'Sports',
    'Lifestyle',
  ];

  const durations = [
    '1 day',
    '2 days',
    '3 days',
    '5 days',
    '1 week',
    '2 weeks',
    '1 month',
  ];

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      newErrors.options = 'At least 2 options are required';
    }

    const uniqueOptions = new Set(validOptions.map(opt => opt.toLowerCase()));
    if (uniqueOptions.size !== validOptions.length) {
      newErrors.options = 'Options must be unique';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      const validOptions = options.filter(opt => opt.trim());
      onCreatePoll({
        title: title.trim(),
        description: description.trim(),
        options: validOptions,
        duration,
        category,
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar onNavigate={onBack} />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white">Create New Poll</h1>
              <p className="text-slate-400">Gather opinions and make informed decisions</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Poll Title */}
          <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <label className="block text-white mb-3">
              Poll Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question?"
              className={`w-full px-4 py-3.5 bg-white/5 border ${
                errors.title ? 'border-red-500/50' : 'border-white/10'
              } rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all`}
              maxLength={100}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-400">{errors.title}</p>
            )}
            <p className="mt-2 text-sm text-slate-400">{title.length}/100 characters</p>
          </div>

          {/* Poll Description */}
          <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <label className="block text-white mb-3">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more context about your poll..."
              rows={4}
              className={`w-full px-4 py-3.5 bg-white/5 border ${
                errors.description ? 'border-red-500/50' : 'border-white/10'
              } rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none`}
              maxLength={500}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-400">{errors.description}</p>
            )}
            <p className="mt-2 text-sm text-slate-400">{description.length}/500 characters</p>
          </div>

          {/* Poll Options */}
          <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <label className="text-white">
                Poll Options <span className="text-red-400">*</span>
              </label>
              <span className="text-sm text-slate-400">
                {options.filter(opt => opt.trim()).length} of {options.length} filled
              </span>
            </div>

            <div className="space-y-3 mb-4">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      maxLength={100}
                    />
                  </div>
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {errors.options && (
              <p className="mb-4 text-sm text-red-400">{errors.options}</p>
            )}

            {options.length < 10 && (
              <button
                type="button"
                onClick={addOption}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all flex items-center justify-center gap-2 border border-white/10 border-dashed"
              >
                <Plus className="w-5 h-5" />
                <span>Add Option</span>
              </button>
            )}
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <label className="block text-white mb-3 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-400" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <label className="block text-white mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all cursor-pointer"
              >
                {durations.map((dur) => (
                  <option key={dur} value={dur} className="bg-slate-900">
                    {dur}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
            <h3 className="text-white mb-3">Preview</h3>
            <div className="space-y-2">
              <p className="text-white">{title || 'Your poll title will appear here'}</p>
              <p className="text-slate-400 text-sm">
                {description || 'Your poll description will appear here'}
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-400 mt-3">
                <span className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  {category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {duration}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]"
            >
              Create Poll
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
